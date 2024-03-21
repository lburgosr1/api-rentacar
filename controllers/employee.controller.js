const { response } = require('express');

const Employee = require('../models/employee.model');

const getEmployees = async (req, res) => {

    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;
    const term = req.query.term || '';
    const regex = new RegExp(term, 'i');

    //Colleccion de promesa
    const [employees, total] = await Promise.all([
        Employee
            .find({
                $and: [
                    { firstName: regex },
                    { lastName: regex },
                ]
            })
            .skip(count * (page - 1))
            .limit(count)
            .sort({ 'firstName': 1 }),

        Employee
            .find({
                $and: [
                    { firstName: regex },
                    { lastName: regex },
                ]
            })
            .count()

    ]);


    res.json({
        ok: true,
        employees,
        total
    });

}

const getEmployeeById = async (req, res) => {

    const id = req.params.id;

    try {
        const employee = await Employee.findById(id);

        res.json({
            ok: true,
            employee
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const createEmployee = async (req, res = response) => {

    const employee = new Employee(req.body);

    try {

        await employee.save();

        res.json({
            ok: true,
            employee: employee
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const updateEmployee = async (req, res = response) => {

    const documentId = req.params.id;

    try {

        const documentDB = await Employee.findById(documentId);

        if (!documentDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Empleado no existe'
            });
        }

        await Employee.findByIdAndUpdate(documentId, req.body);
        const documentUpdate = await Employee.findById(documentId);

        res.json({
            ok: true,
            employee: documentUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

const deleteEmployee = async (req, res = response) => {

    const documentId = req.params.id

    try {
        const documentDB = await Employee.findById(documentId);

        if (!documentDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Empleado no existe'
            });
        }

        const employee = req.body;

        await Employee.findByIdAndUpdate(documentId, employee);
        res.json({
            ok: true,
            msg: 'Estatus actualizado'
        });

    } catch {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Contacte el administrador'
        });
    }
}

module.exports = {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById
}