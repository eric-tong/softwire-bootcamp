namespace csharp.Items
{
    internal class BackstagePass : GildedRoseItem
    {
        public BackstagePass(Item item, bool isConjured) : base(item, isConjured)
        {
        }

        public override int GetChangeInQuality()
        {
            if (SellIn <= 0) return -Quality;
            else if (SellIn <= 5) return 3;
            else if (SellIn <= 10) return 2;
            else return 1;
        }

    }
}