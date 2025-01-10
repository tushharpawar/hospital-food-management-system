import {  NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req:NextRequest,{params}:{params:{id:string}}) => {
  try {
    const {id} = await params
    const patient = await prisma.patient.findFirst({
        where:{
            id
        }}
    );

    if(!patient){
        return NextResponse.json(
            {
              success: false,
              message: "There is no patients",
            },
            { status: 401 }
          );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Patient fetched successfully!",
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
        message: "Failed to get patients",
      },
      { status: 500 }
    );
  }
};
