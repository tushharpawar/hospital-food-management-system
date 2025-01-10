import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  try {
    // Parse the request body
    const { newPatient } = await req.json();

    // Validate required fields
    // if (!name || !diseases || !allergies || !roomNumber || !bedNumber || !floorNumber || !age || !gender || !contactInfo || !emergencyContact) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "All fields are required!",
    //     },
    //     { status: 400 }
    //   );
    // }

    //check is user already exist or not

    const existingPatient = await prisma.patient.findFirst({
      where: {
        contactInfo: newPatient.contactInfo,
      },
    });

    if(existingPatient){
        return NextResponse.json(
            {
              success: false,
              message: "Patient already exist with given contact info.",
            },
            { status: 402 }
          );
    }

    // Create a new patient
    const patient = await prisma.patient.create({
      data: {
        name:newPatient.name,
        diseases:newPatient.diseases,
        allergies:newPatient.allergies,
        roomNumber:parseInt(newPatient.roomNumber),
        bedNumber:parseInt(newPatient.bedNumber),
        floorNumber:parseInt(newPatient.floorNumber),
        age:parseInt(newPatient.age),
        gender:newPatient.gender,
        contactInfo:newPatient.contactInfo,
        emergencyContact:newPatient.emergencyContact,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Patient created successfully!",
        data: patient,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error occurred:", error.message);
    } else if (error instanceof Error) {
      console.error("An error occurred:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create patient",
      },
      { status: 500 }
    );
  }
};
