import mongoose, { Document, Schema } from "mongoose";

interface CartItem {
  _id?: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
}
export interface CartDocument extends Document {
  user: mongoose.Types.ObjectId;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<CartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: true,
  },
);

const cartSchema = new Schema<CartDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);
export const Cart = mongoose.model<CartDocument>("Cart", cartSchema);
