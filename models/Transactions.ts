// models/Transaction.ts

import { Schema, models, model } from "mongoose";

const ParticipantSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    hasPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const TransactionItemSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    qty: {
      type: Number,
      required: true,
      min: 1,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    assignedTo: [
      {
        type: String,
      },
    ],
  },
  {
    _id: false,
  },
);

const TransactionSchema = new Schema(
  {
    place: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    participants: {
      type: [ParticipantSchema],
      default: [],
    },

    items: {
      type: [TransactionItemSchema],
      default: [],
    },

    serviceCharge: {
      type: Number,
      default: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    payToParticipantId: {
      type: String,
      required: true,
    },

    paymentDetails: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Transaction =
  models.Transaction || model("Transaction", TransactionSchema);
