import { Request, Response } from 'express';
import axios from 'axios';
import { Currency } from '../models/currencyModel';

export const SaveConvert = async (req: Request, res: Response): Promise<void> => {

    const { baseCurrency, targetCurrency, baseAmount, convertedAmount } = req.body;
    
    const currency = new Currency({
        baseCurrency,
        targetCurrency,
        baseAmount,
        convertedAmount,
    });
    
    try {
        await currency.save();
        res.status(201).json(currency);
    } catch (error) {
        res.status(400).json({ message: error });
    }
 
};

    export const getConvertAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const currency = await Currency.find();
        res.status(200).json(currency);
    } catch (error) {
        res.status(404).json({ message: error });
    }
  
};
