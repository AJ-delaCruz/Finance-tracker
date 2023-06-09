import {
  createBillService,
  getAllBillsService,
  updateBillPaymentService,
  deleteBillService,
  updateBillService,
} from '../services/billService.js';

// add a bill
const createBill = async (req, res) => {
  const userId = req.user._id;
  const billData = req.body;
  try {
    const newBill = await createBillService(userId, billData);
    res.status(201).json(newBill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// retrieve all bills
const getAllBills = async (req, res) => {
  try {
    const userId = req.user._id;
    const bills = await getAllBillsService(userId);

    // return bills data
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// mark bill paid
const updateBillPayment = async (req, res) => {
  const { billId } = req.params;
  const { isPaid } = req.body;
  const userId = req.user._id;
  // console.log(typeof userId);
  // console.log(userId);

  try {
    const bill = await updateBillPaymentService(userId, billId, isPaid);

    res.status(200).json(bill);
  } catch (error) {
    switch (error.name) {
      case 'UnauthorizedError':
        res.status(403).json({ message: error.message });
        break;
      case 'NotFoundError':
        res.status(404).json({ message: error.message });
        break;
      default:
        res.status(500).json({ message: error.message });
    }
  }
};

// edit bill
const updateBill = async (req, res) => {
  const { billId } = req.params;
  const userId = req.user._id;
  const billData = req.body;
  try {
    const updatedBill = await updateBillService(userId, billId, billData);

    // return updated bill
    res.status(200).json(updatedBill);
  } catch (error) {
    switch (error.name) {
      case 'UnauthorizedError':
        res.status(403).json({ message: error.message });
        break;
      case 'NotFoundError':
        res.status(404).json({ message: error.message });
        break;
      default:
        res.status(500).json({ message: error.message });
    }
  }
};

const deleteBill = async (req, res) => {
  const { billId } = req.params;
  const userId = req.user._id;
  // console.log('Value of billId:', billId);
  // console.log('Value of userId:', userId);

  try {
    const bill = await deleteBillService(userId, billId);

    res.status(200).json(bill);
  } catch (error) {
    // console.error('Error deleting bill:', error);
    switch (error.name) {
      case 'UnauthorizedError':
        res.status(403).json({ message: error.message });
        break;
      case 'NotFoundError':
        res.status(404).json({ message: error.message });
        break;
      default:
        res.status(500).json({ message: error.message });
    }
  }
};

export {
  createBill, getAllBills, updateBillPayment, deleteBill, updateBill,
};
