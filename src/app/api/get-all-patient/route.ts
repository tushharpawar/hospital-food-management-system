import {  NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  try {

    const patients = await prisma.patient.findMany();

    if(!patients){
        return NextResponse.json(
            {
              success: false,
              message: "There is no patients",
              data: patients,
            },
            { status: 401 }
          );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Patient fetched successfully!",
        data: patients,
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
        message: "Failed to get patients",
      },
      { status: 500 }
    );
  }
};
