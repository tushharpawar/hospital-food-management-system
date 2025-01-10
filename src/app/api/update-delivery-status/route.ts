import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  try {

    const { status,id } = await req.json();

    const updateDeliveryStatus = await prisma.deliveryTask.update({
      data: {
        status,
      },
      where: {
        id
      }
    })
    
    if(updateDeliveryStatus){
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
