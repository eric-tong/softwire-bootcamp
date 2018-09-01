using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using NLog;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml;

namespace SupportBank
{
    internal class TransactionsHandler
    {
        private static readonly ILogger logger = LogManager.GetCurrentClassLogger();

        private const string DATE = "date";
        private const string SENDER = "from";
        private const string RECIPIENT = "to";
        private const string NARRATIVE = "narrative";
        private const string AMOUNT = "amount";

        public const int STATUS_IMPORTED = 1;
        public const int STATUS_PENDING = 2;

        private List<string> accounts;
        private List<Transaction> transactions;

        public TransactionsHandler()
        {
            accounts = new List<string>();
            transactions = new List<Transaction>();
        }

        internal void Parse(string filename)
        {
            string fileLocation = "../../res/" + filename;
            logger.Info("File location is " + fileLocation);

            try
            {
                FileStream fileStream = new FileStream(fileLocation, FileMode.Open);
                StreamReader streamReader = new StreamReader(fileStream);

                switch (filename.Split('.').Last().ToLower())
                {
                    case "csv":
                        ParseCSV(streamReader);
                        break;
                    case "json":
                        ParseJSON(streamReader);
                        break;
                    case "xml":
                        ParseXML(streamReader);
                        break;
                }

                streamReader.Close();
                Console.WriteLine("\n" + filename + " successfully imported");
            }
            catch (Exception e)
            {
                logger.Error(filename + " cannot be imported: " + e.Message);
                Console.WriteLine("An error has occured importing " + filename + ": " + e.Message);
            }
        }

        private void ParseCSV(StreamReader streamReader)
        {
            logger.Info("Start parsing CSV");

            List<string> accounts = new List<string>();
            List<Transaction> transactions = new List<Transaction>();

            // Read from CSV with filename
            logger.Info("Open CSV from filename");
            string line;
            if ((line = streamReader.ReadLine()) != null)
            {
                // Get indices from header
                List<string> headers = line.ToLower().Split(',').ToList();
                int dateIndex = headers.IndexOf(DATE);
                int senderNameIndex = headers.IndexOf(SENDER);
                int recipientNameIndex = headers.IndexOf(RECIPIENT);
                int narrativeIndex = headers.IndexOf(NARRATIVE);
                int amountIndex = headers.IndexOf(AMOUNT);

                // Create transcation and add to list
                // Also add new account names to list
                int lineCount = 2;
                List<KeyValuePair<int, int>> errorList = new List<KeyValuePair<int, int>>();
                while ((line = streamReader.ReadLine()) != null)
                {
                    string[] data = line.Split(',');
                    string senderName = data[senderNameIndex];
                    string recipientName = data[recipientNameIndex];

                    // Load new account into accounts
                    if (!accounts.Contains(senderName)) accounts.Add(senderName);
                    if (!accounts.Contains(recipientName)) accounts.Add(recipientName);

                    // Parse strings with Try/Catch
                    DateTime dateTime = new DateTime();
                    float amount = 0;
                    try
                    {
                        dateTime = Convert.ToDateTime(data[dateIndex]);
                    }
                    catch
                    {
                        logger.Warn("Failed to parse date on line " + lineCount);
                        errorList.Add(new KeyValuePair<int, int>(lineCount, InterfaceHandler.ERROR_DATE));
                        continue;
                    }

                    try
                    {
                        amount = float.Parse(data[amountIndex]);
                    }
                    catch
                    {
                        logger.Warn("Failed to parse amount on line " + lineCount);
                        errorList.Add(new KeyValuePair<int, int>(lineCount, InterfaceHandler.ERROR_AMOUNT));
                        continue;
                    }

                    // Add new transaction to transactions list
                    transactions.Add(new Transaction(
                        transactions.Count,
                        dateTime,
                        senderName,
                        recipientName,
                        data[narrativeIndex],
                        amount
                        ));

                    lineCount++;
                }

                InterfaceHandler.PrintImportErrors(errorList);

                // Save on successful parsing
                Save(accounts, transactions);

                logger.Info("Finish parsing CSV");
            }
        }

        private void ParseJSON(StreamReader streamReader)
        {
            logger.Info("Start parsing JSON");

            List<string> accounts = new List<string>();
            List<Transaction> transactions = new List<Transaction>();

            string line;
            string jsonString = "";
            while ((line = streamReader.ReadLine()) != null)
            {
                jsonString += line;
            }

            // Format json to Transaction class format
            jsonString = jsonString.Replace("Date", "date")
                                .Replace("FromAccount", "senderName")
                                .Replace("ToAccount", "recipientName")
                                .Replace("Narrative", "narrative")
                                .Replace("Amount", "amount");

            // Deserialise to transaction list
            try
            {
                transactions.AddRange(JsonConvert.DeserializeObject<List<Transaction>>(jsonString));
            }
            catch
            {
                throw new Exception("Unable to import JSON file. Please check that the file has been formatted properly.");
            }

            // Setup accounts
            foreach (Transaction transaction in transactions)
            {
                if (!accounts.Contains(transaction.senderName)) accounts.Add(transaction.senderName);
                if (!accounts.Contains(transaction.recipientName)) accounts.Add(transaction.recipientName);
            }

            // Save on successful parsing
            Save(accounts, transactions);

            logger.Info("Finish parsing JSON");
        }

        private void ParseXML(StreamReader streamReader)
        {
            logger.Info("Start parsing XML");

            List<string> accounts = new List<string>();
            List<Transaction> transactions = new List<Transaction>();

            // Get XML string
            string line;
            string xmlString = "";
            while ((line = streamReader.ReadLine()) != null)
            {
                xmlString += line;
            }

            // Load XML document
            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.LoadXml(xmlString);

            // Get XML elements
            XmlNodeList transactionList = xmlDoc.SelectNodes("//TransactionList/SupportTransaction");

            // Populate transactions
            foreach (XmlNode transaction in transactionList)
            {

                int daysPast1990 = int.Parse(transaction.Attributes["Date"].Value);
                string narrative = transaction["Description"].InnerText;
                float amount = float.Parse(transaction["Value"].InnerText);
                string senderName = transaction["Parties"]["From"].InnerText;
                string recipientName = transaction["Parties"]["To"].InnerText;

                DateTime date = Convert.ToDateTime("01/01/1900");
                date = date.AddDays(daysPast1990);

                if (!accounts.Contains(senderName)) accounts.Add(senderName);
                if (!accounts.Contains(recipientName)) accounts.Add(recipientName);

                transactions.Add(new Transaction(transactions.Count,
                    date,
                    senderName,
                    recipientName,
                    narrative,
                    amount));
            }

            // Save on successful parsing
            Save(accounts, transactions);

            logger.Info("Finish parsing XML");
        }

        private void Save(List<string> accounts, List<Transaction> transactions)
        {
            if (transactions != null && accounts != null)
            {
                if (transactions.Any())
                {
                    this.accounts = accounts;
                    this.transactions = transactions;
                }
                else
                    InterfaceHandler.PrintError(InterfaceHandler.ERROR_EMPTY);
            }

        }

        public List<Transaction> GetTransactions()
        {
            return this.transactions;
        }
        public List<string> GetAccounts()
        {
            return this.accounts;
        }

        public int GetStatus()
        {
            if (transactions != null && transactions.Any()) return STATUS_IMPORTED;
            else return STATUS_PENDING;
        }
    }
}