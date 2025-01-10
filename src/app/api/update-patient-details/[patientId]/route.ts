import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest,{params}:{params:{patientId:string}}) => {
  try {
    const {patientId} = await params
    const { updatedPatient } = await req.json();
  
    const updatePatientDetails = await prisma.patient.update({
      data: {
        name:updatedPatient.name,
        diseases:updatedPatient.diseases,
        allergies:updatedPatient.allergies,
        roomNumber:updatedPatient.roomNumber,
        bedNumber:parseInt(updatedPatient.bedNumber),
        floorNumber:parseInt(updatedPatient.floorNumber),
        age:parseInt(updatedPatient.age),
        gender:updatedPatient.gender,
        contactInfo:updatedPatient.contactInfo,
        emergencyContact:updatedPatient.emergencyContact,
      },
      where: {
        id:patientId
      }
    })

    if(updatePatientDetails){
        return NextResponse.json(
            {
              success: true,
              message: "Patient details updated",
            },
            { status: 202 }
          );
    }else{
        return NextResponse.json(
            {
              success: true,
              message: "Failed to update patient details",
            },
            { status: 501 }
          );
    } 
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error occurred:", error.message);
    } else if (error instanceof Error) {
      console.error("Error occurred:", error.message);
    } else {
      console.error("Something went wrong:", error);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update patient details",
      },
      { status: 500 }
    );
  }
};
