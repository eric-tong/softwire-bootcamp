using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace csharp.Items
{
    public class GildedRoseItem : Item
    {
        private readonly bool IsConjured = false;

        public GildedRoseItem(Item item) : this(item, false)
        {
        }

        public GildedRoseItem(Item item, bool isConjured)
        {
            this.Name = item.Name;
            this.SellIn = item.SellIn;
            this.Quality = item.Quality;
            this.IsConjured = isConjured;
        }

        public static GildedRoseItem FromItem(Item item)
        {
            return FromItem(item, item.Name.StartsWith("Conjured"));
        }

        private static GildedRoseItem FromItem(Item item, bool isConjured)
        {
            String itemName = item.Name;
            if (isConjured) itemName = itemName.Substring("Conjured ".Length);

            switch (itemName)
            {
                case "Aged Brie":
                    return new AgedBrie(item, isConjured);
                case "Backstage passes to a TAFKAL80ETC concert":
                    return new BackstagePass(item, isConjured);
                case "Sulfuras, Hand of Ragnaros":
                    return new Sulfuras(item, isConjured);
                default:
                    return new GildedRoseItem(item, isConjured);
            }
        }

        public virtual void UpdateQualityAndSellIn()
        {
            Quality += GetChangeInQuality() * (IsConjured ? 2 : 1);
            SellIn += GetChangeInSellIn();

            Quality = Math.Min(50, Quality);
            Quality = Math.Max(0, Quality);
        }

        public virtual int GetChangeInQuality()
        {
            return IsQualityDegradeTwiceAsFast() ? -2 : -1;
        }

        public virtual int GetChangeInSellIn()
        {
            return -1;
        }

        protected bool IsQualityDegradeTwiceAsFast()
        {
            return SellIn <= 0;
        }
    }
}
