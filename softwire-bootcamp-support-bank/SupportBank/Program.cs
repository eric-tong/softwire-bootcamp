using NLog;
using NLog.Config;
using NLog.Targets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportBank
{
    class Program
    {
        private static readonly ILogger logger = LogManager.GetCurrentClassLogger();
        private static TransactionsHandler transactionsHandler;

        static void Main(string[] args)
        {
            logger.Info("===========================");
            logger.Info("Start SupportBank session");

            ConfigLogger();
            InterfaceHandler.PrintWelcome();

            // Parse CSV and generate transactions list and accounts list
            // TODO Move to new Importer class
            string defaultImport = "Transactions2012.xml";
            transactionsHandler = new TransactionsHandler();
            transactionsHandler.Parse(defaultImport);

            // Start program loop
            // TODO move to new CommandHandler class
            while (true)
            {
                InterfaceHandler.PrintAvailableCommands(transactionsHandler.GetStatus());
                string command = Console.ReadLine();
                logger.Info("User command: " + command);
                switch (command.ToLower())
                {
                    case "list transactions":
                        InterfaceHandler.Print(transactionsHandler.GetTransactions());
                        break;
                    case "list accounts":
                        InterfaceHandler.Print(transactionsHandler.GetAccounts());
                        break;
                    case "list all":
                        InterfaceHandler.Print(transactionsHandler.GetTransactions(), transactionsHandler.GetAccounts());
                        break;
                    default:
                        if (command.ToLower().StartsWith("list "))
                        {
                            string selectedAccount = command.Substring("list ".Length);
                            InterfaceHandler.Print(selectedAccount, transactionsHandler.GetTransactions(), transactionsHandler.GetAccounts());
                        }
                        else if (command.ToLower().StartsWith("import file "))
                        {
                            string filename = command.Substring("import file ".Length);
                            transactionsHandler.Parse(filename);
                        }
                        else
                        {
                            Console.WriteLine("Command not recognised. Please try again.");
                        }
                        break;
                }
            }
        }

        private static void ConfigLogger()
        {
            var config = new LoggingConfiguration();
            var target = new FileTarget { FileName = @"C:\Work\Logs\SupportBank.log", Layout = @"${longdate} ${level} - ${logger}: ${message}" };
            config.AddTarget("File Logger", target);
            config.LoggingRules.Add(new LoggingRule("*", LogLevel.Info, target));
            LogManager.Configuration = config;
        } 
    }
}
