using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FizzBuzz
{
    class Program
    {
        public const string FIZZ = "Fizz";
        public const string BUZZ = "Buzz";
        public const string BANG = "Bang";
        public const string BONG = "Bong";
        public const string FEZZ = "Fezz";

        static void Main(string[] args)
        {
            // Get total length from user
            Console.Write("What is the total length? ");
            int totalLength = Int32.Parse(Console.ReadLine());

            for (int i = 1; i <= totalLength; i++)
            {
                List<String> output = new List<string>();

                bool fizzable = i % 3 == 0;
                bool buzzable = i % 5 == 0;
                bool bangable = i % 7 == 0;
                bool bongable = i % 11 == 0;
                bool fezzable = i % 13 == 0;
                bool reversible = i % 17 == 0;

                // RULE 1: For multiple of 3 append Fizz, multiple of 5 append Buzz, multiple of 7 append Bang
                if (fizzable) output.Add(FIZZ);
                if (buzzable) output.Add(BUZZ);
                if (bangable) output.Add(BANG);

                // RULE 2: For multiple of 11, remove all and append Bong
                if (bongable)
                {
                    output.Clear();
                    output.Add(BONG);
                }

                // RULE 3: For multiple of 13, add Fezz in front of first thing starting with B
                // If none present, append to end
                if (fezzable)
                {
                    bool noBsPresent = true;
                    for (int j = 0; j < output.Count; j++)
                    {
                        if (output[j].StartsWith("B"))
                        {
                            output.Insert(j, FEZZ);
                            noBsPresent = false;
                            break;
                        }
                    }
                    if (noBsPresent) output.Add(FEZZ);
                }

                // RULE 4: For multiple of 17, reverse all
                if (reversible) output.Reverse();

                // If output is non-empty, output concat of list
                // Else, output number
                if (output.Any()) Console.WriteLine(i + " " + String.Join("", output.ToArray()));
                else Console.WriteLine(i);
            }
            Console.ReadLine();
        }
    }
}
