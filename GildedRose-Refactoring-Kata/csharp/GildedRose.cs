using System.Collections.Generic;
using System.Linq;
using csharp.Items;

namespace csharp
{
    public class GildedRose
    {
        IList<GildedRoseItem> Items;
        public GildedRose(IList<Item> itemsToUpdate)
        {
            this.Items = itemsToUpdate.Select(GildedRoseItem.FromItem).ToList();
            ReplaceInputItems(itemsToUpdate);
        }

        public void UpdateQuality()
        {
            foreach (var item in Items) item.UpdateQualityAndSellIn();
        }

        private void ReplaceInputItems(IList<Item> inputItems)
        {
            inputItems.Clear();
            foreach (var item in this.Items) inputItems.Add(item);
        }
    }
}
