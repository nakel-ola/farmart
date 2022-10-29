import { mongodbDefaultType } from './custom.d';
export interface CouponType extends mongodbDefaultType {
  id: string;
  email: string;
  discount: number;
  code: string;
  userId: string;
  description?: string;
  expiresIn: Date;
}

export type CouponsArgs = {
  customerId?: string;
};

export type VerifyCouponArgs = {
  input: {
    email: string;
    coupon: string;
    customerId?: string;
  };
};

export type CreateCouponType = {
  input: {
    discount: number;
    email: string;
    description?: string;
    userId: string;
    expiresIn: Date;
  };
};
