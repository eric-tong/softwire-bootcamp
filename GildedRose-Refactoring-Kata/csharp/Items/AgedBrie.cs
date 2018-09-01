namespace csharp.Items
{
    internal class AgedBrie : GildedRoseItem
    {
        public AgedBrie(Item item, bool isConjured) : base(item, isConjured)
        {
        }

        public override int GetChangeInQuality()
        {
            return base.GetChangeInQuality() * -1;
        }
    }
}