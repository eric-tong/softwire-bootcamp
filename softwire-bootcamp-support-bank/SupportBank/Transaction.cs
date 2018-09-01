using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

public class Transaction
{

    public int id;
    public DateTime date;
    public string senderName;
    public string recipientName;
    public string narrative;
    public float amount;

    public Transaction(
        int id,
        DateTime date,
        string senderName,
        string recipientName,
        string narrative,
        float amount)
    {
        this.id = id;
        this.date = date;
        this.senderName = senderName;
        this.recipientName = recipientName;
        this.narrative = narrative;
        this.amount = amount;
    }
}
