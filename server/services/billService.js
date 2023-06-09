import BillModel from '../models/BillModel.js';
import NotFoundError from '../config/NotFoundError.js';
import UnauthorizedError from '../config/UnauthorizedError.js';

const createBillService = async (userId, billData) => {
  const newBill = new BillModel({ userId, ...billData });
  await newBill.save();
  return newBill;
};

const getAllBillsService = async (userId) => {
  const bills = await BillModel.find({ userId });
  return bills;
};

const updateBillPaymentService = async (userId, billId, isPaid) => {
  const bill = await BillModel.findById(billId);
  // console.log(typeof bill.userId);
  // console.log(typeof bill.userId);

  if (!bill) {
    throw new NotFoundError('Bill not found');
  }
  // check for authentication
  if (bill.userId.toString() !== userId.toString()) {
    throw new UnauthorizedError('You do not have permission to update this bill.');
  }

  bill.isPaid = isPaid;
  await bill.save();
  return bill;
};

const updateBillService = async (userId, billId, billData) => {
  const bill = await BillModel.findById(billId);

  if (!bill) {
    throw new NotFoundError('Bill not found');
  }
  // check for authentication
  if (bill.userId.toString() !== userId.toString()) {
    throw new UnauthorizedError('You do not have permission to update this bill.');
  }
  // update bill
  const updatedBill = await BillModel.findByIdAndUpdate(
    billId,
    billData,
    { new: true },
  );

  return updatedBill;
};

const deleteBillService = async (userId, billId) => {
  const bill = await BillModel.findById(billId);

  if (!bill) {
    throw new NotFoundError('Bill not found');
  }
  // check for authentication
  if (bill.userId.toString() !== userId.toString()) {
    throw new UnauthorizedError('You do not have permission to remove this bill.');
  }
  // Model.prototype.deleteOne()
  await bill.deleteOne();
  return bill;
};

export {
  createBillService,
  getAllBillsService,
  updateBillPaymentService,
  updateBillService,
  deleteBillService,
};
