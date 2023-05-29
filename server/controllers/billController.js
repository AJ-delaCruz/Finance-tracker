import BillModel from '../models/BillModel.js';

const createBill = async (req, res) => {
  const userId = req.user._id;
  try {
    const newBill = new BillModel({ userId, ...req.body });
    await newBill.save();
    res.status(201).json(newBill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBills = async (req, res) => {
  try {
    const userId = req.user._id;
    const bills = await BillModel.find({ userId });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBillPayment = async (req, res) => {
  const { billId } = req.params;
  const { isPaid } = req.body;
  const userId = req.user._id;
  // console.log(typeof userId);
  // console.log(userId);

  try {
    const bill = await BillModel.findById(billId);
    // console.log(typeof bill.userId);
    // console.log(typeof bill.userId);

    if (!bill) {
      res.status(404).json({ message: 'Bill not found' });
      return;
    }

    // check for authentication
    if (bill.userId.toString() !== userId.toString()) {
      res.status(403).json({ message: 'You do not have permission to update this bill.' });
      return;
    }

    bill.isPaid = isPaid;
    await bill.save();

    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBill = async (req, res) => {
  const { billId } = req.params;
  const userId = req.user._id;
  // console.log('Value of billId:', billId);
  // console.log('Value of userId:', userId);

  try {
    const bill = await BillModel.findById(billId);
    if (!bill) {
      res.status(404).json({ message: 'Bill not found' });
      return;
    }
    // check for authentication
    if (bill.userId.toString() !== userId.toString()) {
      res.status(403).json({ message: 'You do not have permission to remove this bill.' });
      return;
    }
    // Model.prototype.deleteOne()
    await bill.deleteOne();

    res.status(200).json(bill);
  } catch (error) {
    // console.error('Error deleting bill:', error);
    res.status(500).json({ message: error.message });
  }
};

export {
  createBill, getAllBills, updateBillPayment, deleteBill,
};
