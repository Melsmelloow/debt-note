// app/api/transaction/route.ts

import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transactions";

// CREATE TRANSACTION
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const transaction = await Transaction.create(body);

    return NextResponse.json(transaction, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create transaction",
      },
      {
        status: 500,
      },
    );
  }
}

// GET ALL TRANSACTIONS
export async function GET() {
  try {
    await connectDB();

    const transactions = await Transaction.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(transactions, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch transactions",
      },
      {
        status: 500,
      },
    );
  }
}
