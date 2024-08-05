import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const updateDoctor = async(req,res) => {
    const id = req.params.id;

    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, {$set:req.body}, {new:true});
        res.status(200).json({success:true, message:'Successfully updated', data:updatedDoctor});

    } catch (err) {
        res.status(500).json({success:false, message:'Failed to update'});
    }
}

export const deleteDoctor= async(req,res) => {
    const id = req.params.id;

    try {
        await Doctor.findByIdAndDelete(id);
        res.status(200).json({success:true, message:'Successfully deleted'});

    } catch (err) {
        res.status(500).json({success:false, message:'Failed to delete'});
    }
}

export const getSingleDoctor = async(req,res) => {
    const id = req.params.id;

    try {
        const doctor = await Doctor.findById(id)
           .populate("reviews")
           .select("-password");
        res.status(200).json({success:true, message:'Doctor found successfully', data:doctor});

    } catch (err) {
        res.status(404).json({success:false, message:'No doctor found'});
    }
}

export const getAllDoctor = async(req,res) => {

    try {
        const {query} = req.query;
        let doctors;

        if(query){
            doctors = await Doctor.find({
                isApproved:'approved', 
                $or:[
                    { name: { $regex: query, $options: "i" } },
                    { specialization: { $regex: query, $options: "i" } },
                ],
            }).select("-password");
        } else{
            doctors = await Doctor.find({isApproved:'approved'}).select("-password");
        }

        res.status(200).json({success:true, message:'Doctors found', data:doctors});

    } catch (err) {
        res.status(404).json({success:false, message:'Not found'});
    }
}

export const getDoctorProfile = async(req,res) => {
    const doctorId = req.userId;

    try {
        const doctor = await Doctor.findById(doctorId);

        if(!doctor){
            return res.status(404).json({success: false, message: 'doctor not found'});
        }

        const {password, ...reset} = doctor._doc;
        const appointments = await Booking.find({doctor: doctorId});

        res.status(200).json({
            success: true, 
            message: 'Got profile info', 
            data:{ ...reset, appointments }});

    } catch (err) {
        res.status(500).json({success: false, message: 'something went wrong'});
    }
}