const { response } = require('express');

const Employee = require('../models/employee.model');
const User = require('../models/user.model');

const getEmployees = async (req, res) => {

    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;
    const term = req.query.term || '';
    const regex = new RegExp(term, 'i');
    const status = req.query.status || true;

    //Colleccion de promesa
    const [employees, total] = await Promise.all([
        Employee
            .find({
                $or: [
                    { firstName: regex },
                    { lastName: regex },
                    { phone: regex }
                ],
                $and: [
                    { status: status }
                ]
            })
            .skip(count * (page - 1))
            .limit(count)
            .sort({ 'firstName': 1 }),

        Employee
            .find({
                $or: [
                    { firstName: regex },
                    { lastName: regex },
                    { phone: regex }
                ],
                $and: [
                    { status: status }
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

    const employeeId = req.params.id;

    try {

        const employeeDB = await Employee.findById(employeeId);

        if (!employeeDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Empleado no existe'
            });
        }

        const userDB = await User.findOne({user: userId});

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontro el usuario'
            });
        }

        userDB.status = req.body.status;

        const userUpdate = await User.findByIdAndUpdate(employeeDB.user, userDB);

        if (!userUpdate) {
            return res.status(400).json({
                ok: false,
                msg: 'No se pudo actualizar el usuario'
            });
        }

        await Employee.findByIdAndUpdate(employeeId, req.body);
        const employeeUpdate = await Employee.findById(employeeId);

        res.json({
            ok: true,
            employee: employeeUpdate
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

    const employeeId = req.params.id

    try {
        const employeeDB = await Employee.findById(employeeId);

        if (!employeeDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Empleado no existe'
            });
        }

        const employee = req.body;

        await Employee.findByIdAndUpdate(employeeId, employee);
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