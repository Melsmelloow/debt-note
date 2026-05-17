// app/api/transaction/[id]/route.ts

import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transactions";

type Params = {
  params: {
    id: string;
  };
};

// GET SINGLE TRANSACTION
export async function GET(req: Request, { params }: Params) {
  try {
    await connectDB();

    const transaction = await Transaction.findById(params.id);

    console.log(transaction);
    if (!transaction) {
      return NextResponse.json(
        {
          error: "Transaction not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(transaction, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch transaction",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await req.json();

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
      },
    );

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update transaction",
      },
      {
        status: 500,
      },
    );
  }
}