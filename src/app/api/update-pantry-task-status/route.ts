import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req:NextRequest) => {
  try {

    const { status,id,deliveryPersonnelName,deliveryPersonnelContact } = await req.json();

    const pantryStaffExist = await prisma.pantryTask.findFirst({
      where:{
        id
      }
    })

    if(!pantryStaffExist){
      return NextResponse.json(
        {
          success: false,
          message: "Pantry staff does not exist",
        },
        { status: 404 }
      );
    }

    const updatePantryTaskStatus = await prisma.pantryTask.update({
      data: {
        status,
        deliveryPersonnelName,
        deliveryPersonnelContact,
      },
      where: {
        id
      }
    })
    
    if(updatePantryTaskStatus){
      return NextResponse.json(
        {
          success: true,
          message: "Status updated",
        },
        { status: 202 }
      );
    }else{
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update status",
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
        message: "Failed to update status",
      },
      { status: 500 }
    );
  }
};
