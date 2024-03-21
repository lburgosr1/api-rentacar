const puppeteer = require('puppeteer');
const Invoice = require('../models/invoice.model');

const generateInvoice = async (req, res) => {
    const url = req.body.url;
    //Open browser
    let browser = await puppeteer.launch();

    //Create new tag o page
    let page = await browser.newPage();

    await page.goto(url);

    let pdf = await page.pdf({
        format: 'A4',
    });

    browser.close();

    res.contentType('application/pdf');
    res.send(pdf);
}

const getInvoice = async (req, res) => {
    const id = req.params.id;

    try {
        const invoice = await Invoice.find({rentacar: id})
        .populate({ path: 'rentacar', populate: { path: 'vehicle', populate: { path: 'typeVehicle', select: 'typeVehicle'} } })
        .populate({ path: 'rentacar', populate: { path: 'vehicle', populate: { path: 'brand', select: 'brandVehicle'} } })
        .populate({ path: 'rentacar', populate: { path: 'vehicle', populate: { path: 'model', select: 'vehicleModel'} } })
        .populate({ path: 'rentacar', populate: { path: 'coin', select: 'symbol' } })
        .populate({ path: 'rentacar', populate: { path: 'customer' } })
        
        res.status(200).json({
            ok: true,
            invoice
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

module.exports = {
    generateInvoice,
    getInvoice
}