using System.Collections.Generic;
using csharp.Items;
using NUnit.Framework;
using FluentAssertions;

namespace csharp
{
    [TestFixture]
    public class GildedRoseTest
    {
        [Test]
        public void QualityDegradesEveryDay()
        {
            int initialQuality = 50;
            List<Item> items = new List<Item> { new Item { Name = "foo", SellIn = 20, Quality = initialQuality } };

            GildedRose app = new GildedRose(items);
            app.UpdateQuality();
            items[0].Quality.Should().Be(initialQuality - 1);
        }

        [Test]
        public void QualityDegradesTwiceAsFast_IfSellByDateHasPassed()
        {
            int initialQuality = 50;
            List<Item> items = new List<Item> { new Item { Name = "foo", SellIn = -5, Quality = initialQuality } };

            GildedRose app = new GildedRose(items);
            app.UpdateQuality();
            items[0].Quality.Should().Be(initialQuality - 2);
        }

        [Test]
        public void QualityIsNeverNegative()
        {
            int initialQuality = 50;
            List<Item> items = new List<Item> { new Item { Name = "foo", SellIn = 20, Quality = initialQuality } };

            GildedRose app = new GildedRose(items);
            for (int i = 0; i < 200; i++)
            {
                app.UpdateQuality();
            }
            items[0].Quality.Should().BeGreaterOrEqualTo(0);
        }

        [Test]
        public void AgedBrieIncreasesInQualityTheOlderItGets()
        {
            int initialQuality = 10;
            List<Item> items = new List<Item> { new Item { Name = "Aged Brie", SellIn = 1, Quality = initialQuality } };

            GildedRose app = new GildedRose(items);
            app.UpdateQuality();
            items[0].Quality.Should().Be(11);
            app.UpdateQuality();
            items[0].Quality.Should().Be(13);
            app.UpdateQuality();
            items[0].Quality.Should().Be(15);
        }

        [Test]
        public void QualityIsNeverMoreThanFifty()
        {
            int initialQuality = 50;
            List<Item> items = new List<Item> { new Item { Name = "Aged Brie", SellIn = 20, Quality = initialQuality } };

            GildedRose app = new GildedRose(items);
            app.UpdateQuality();
            items[0].Quality.Should().BeLessOrEqualTo(50);
        }

        [Test]
        public void SulfurasNeverHasToBeSold()
        {
            List<Item> items = new List<Item> { new Item { Name = "Sulfuras, Hand of Ragnaros", SellIn = 1, Quality = 80 } };

            GildedRose app = new GildedRose(items);
            app.UpdateQuality();
            items[0].SellIn.Should().BeGreaterThan(0);
        }

        [Test]
        public void SulfurasNeverDecreasesInQuality()
        {
            List<Item> items = new List<Item> { new Item { Name = "Sulfuras, Hand of Ragnaros", SellIn = 1, Quality = 80 } };

            GildedRose app = new GildedRose(items);
            app.UpdateQuality();
            items[0].Quality.Should().Be(80);
        }

        [Test]
        public void BackstagePassesHasVariableQualityChanges()
        {
            int initialQuality = 1;
            List<Item> items = new List<Item> { new Item { Name = "Backstage passes to a TAFKAL80ETC concert", SellIn = 20, Quality = initialQuality } };

            GildedRose app = new GildedRose(items);
            for (int i = 0; i < 20; i++)
            {
                app.UpdateQuality();

                if (items[0].SellIn < 0) initialQuality = 0;
                else if (items[0].SellIn < 5) initialQuality += 3;
                else if (items[0].SellIn < 10) initialQuality += 2;
                else initialQuality++;
            }
            items[0].Quality.Should().Be(initialQuality);
            app.UpdateQuality();
            items[0].Quality.Should().Be(0);
        }

        [Test]
        public void ConjuredItem_QualityDegradesEveryDay()
        {
            int initialQuality = 50;
            List<Item> items = new List<Item> { new Item { Name = "Conjured foo", SellIn = 20, Quality = initialQuality } };

            GildedRose app = new GildedRose(items);
            app.UpdateQuality();
            items[0].Quality.Should().Be(initialQuality - 2);
        }

        [Test]
        public void ConjuredItem_QualityDegradesTwiceAsFast_IfSellByDateHasPassed()
        {
            int initialQuality = 50;
            List<Item> items = new List<Item> { new Item { Name = "Conjured foo", SellIn = -5, Quality = initialQuality } };

            GildedRose app = new GildedRose(items);
            app.UpdateQuality();
            items[0].Quality.Should().Be(initialQuality - 4);
        }

        [Test]
        public void ConjuredItem_AgedBrieIncreasesInQualityTheOlderItGets()
        {
            int initialQuality = 10;
            List<Item> items = new List<Item> { new Item { Name = "Conjured Aged Brie", SellIn = 1, Quality = initialQuality } };

            GildedRose app = new GildedRose(items);
            app.UpdateQuality();
            items[0].Quality.Should().Be(12);
            app.UpdateQuality();
            items[0].Quality.Should().Be(16);
            app.UpdateQuality();
            items[0].Quality.Should().Be(20);
        }

        [Test]
        public void ConjuredItem_BackstagePassesHasVariableQualityChanges()
        {
            int initialQuality = 1;
            List<Item> items = new List<Item> { new Item { Name = "Conjured Backstage passes to a TAFKAL80ETC concert", SellIn = 20, Quality = initialQuality } };

            GildedRose app = new GildedRose(items);
            for (int i = 0; i < 10; i++)
            {
                app.UpdateQuality();

                if (items[0].SellIn < 0) initialQuality = 0;
                else if (items[0].SellIn < 5) initialQuality += 6;
                else if (items[0].SellIn < 10) initialQuality += 4;
                else initialQuality += 2;
            }
            items[0].Quality.Should().Be(initialQuality);
        }
    }
}
