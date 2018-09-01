using System;
using System.Collections.Generic;
using System.Linq;

namespace SupportBank
{
    internal class InterfaceHandler
    {
        // INTERFACE HANDLER
        // Handle all user interface interactions

        private const int AMOUNT_STRING_LENGTH = 10;
        private const int ACCOUNT_STRING_LENGTH = 15;
        private const int COMMENT_STRING_LENGTH = 40;

        public const int ERROR_DATE = 1;
        public const int ERROR_AMOUNT = 2;
        public const int ERROR_EMPTY = 3;

        public static void PrintWelcome()
        {
            Console.WriteLine(
                "   _____        __ _   _                 _    " + "\n" +
                "  / ____|      / _| | | |               | |   " + "\n" +
                " | (___   ___ | |_| |_| |__   __ _ _ __ | | __" + "\n" +
                "  \\___ \\ / _ \\|  _| __| '_ \\ / _` | '_ \\| |/ /" + "\n" +
                "  ____) | (_) | | | |_| |_) | (_| | | | |   < " + "\n" +
                " |_____/ \\___/|_|  \\__|_.__/ \\__,_|_| |_|_|\\_\\");
            Console.WriteLine("\nWelcome to Softbank!");
        }

        public static void Print(Transaction transaction)
        {
            Console.WriteLine(
                $"{transaction.id,AMOUNT_STRING_LENGTH}" +
                $"{transaction.date.ToString("dd/MM/yyyy"),ACCOUNT_STRING_LENGTH}" +
                $"{transaction.senderName,ACCOUNT_STRING_LENGTH}" +
                $"{transaction.recipientName,ACCOUNT_STRING_LENGTH}" +
                $"{transaction.narrative,COMMENT_STRING_LENGTH}" +
                $"{transaction.amount,AMOUNT_STRING_LENGTH}"
                );
        }

        public static void Print(List<Transaction> transactions)
        {
            Console.WriteLine(
                "\n" +
                $"{"Id",AMOUNT_STRING_LENGTH}" +
                $"{"Date",ACCOUNT_STRING_LENGTH}" +
                $"{"From",ACCOUNT_STRING_LENGTH}" +
                $"{"To",ACCOUNT_STRING_LENGTH}" +
                $"{"Narrative",COMMENT_STRING_LENGTH}" +
                $"{"Amount",AMOUNT_STRING_LENGTH}" +
                "\n"
                );
            foreach (Transaction transaction in transactions) Print(transaction);
        }
        public static void Print(List<string> accounts)
        {
            Console.WriteLine("\nName\n");
            foreach (string account in accounts) Console.WriteLine(account);
        }
        public static void Print(List<Transaction> transactions, List<string> accounts)
        {
            Console.WriteLine(
                    "\n" +
                    $"{"Account",ACCOUNT_STRING_LENGTH}" +
                    $"{"Loaned",AMOUNT_STRING_LENGTH}" +
                    $"{"Owed",AMOUNT_STRING_LENGTH}" +
                    $"{"Total",AMOUNT_STRING_LENGTH}"
                    + "\n"
                    );

            foreach (string account in accounts)
            {
                float amountLoaned = 0;
                float amountOwed = 0;

                foreach (Transaction transaction in transactions)
                {
                    if (transaction.senderName == account) amountLoaned += transaction.amount;
                    if (transaction.recipientName == account) amountOwed += transaction.amount;
                }

                Console.WriteLine(
                    $"{account,ACCOUNT_STRING_LENGTH}" +
                    $"{amountLoaned.ToString("0.00"),AMOUNT_STRING_LENGTH}" +
                    $"{amountOwed.ToString("0.00"),AMOUNT_STRING_LENGTH}" +
                    $"{(amountLoaned - amountOwed).ToString("0.00"),AMOUNT_STRING_LENGTH}"
                    );
            }
        }
        public static void Print(string selectedAccount, List<Transaction> transactions, List<string> accounts)
        {
            if (accounts.Contains(selectedAccount))
            {
                Print(transactions.Where(transaction => transaction.senderName == selectedAccount || transaction.recipientName == selectedAccount).ToList());
            }
            else
            {
                Console.WriteLine(selectedAccount + " could not be found. Please try again.");
            }
        }

        public static void PrintAvailableCommands(int status)
        {
            switch (status)
            {
                case TransactionsHandler.STATUS_IMPORTED:
                    Console.WriteLine("\nAvailable commands\n" +
                        "1\tList Transactions\n" +
                        "2\tList Accounts\n" +
                        "3\tList All\n" +
                        "4\tList [Account Name]\n" +
                        "5\tImport File [File Name]\n");
                    break;
                case TransactionsHandler.STATUS_PENDING:
                    Console.WriteLine("\nAvailable commands\n" +
                        "1\tImport File [File Name]\n");
                    break;
            }
        }

        public static void PrintImportErrors(List<KeyValuePair<int, int>> errorList)
        {
            foreach (KeyValuePair<int, int> error in errorList)
            {
                switch (error.Value)
                {
                    case ERROR_DATE:
                        Console.WriteLine("There is an error with the Date on line " + error.Key + " and was skipped.");
                        break;
                    case ERROR_AMOUNT:
                        Console.WriteLine("There is an error with the Amount on line " + error.Key + " and was skipped.");
                        break;
                }
            }
        }

        public static void PrintError(int errorCode)
        {
            switch (errorCode)
            {
                case ERROR_EMPTY:
                    Console.WriteLine("No transactions were found in the file.");
                    break;
            }
        }

    }
}