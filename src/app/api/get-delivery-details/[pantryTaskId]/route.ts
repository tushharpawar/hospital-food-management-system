import {  NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req:NextRequest,{params}:{params:{pantryTaskId:string}},res:NextResponse) => {

  try {
    const pantryTaskId = await params.pantryTaskId

    const deliveryDetails = await prisma.pantryTask.findFirst({
        where:{
            id:pantryTaskId
        },
        include:{
            DeliveryTask:true
        }
    });

    if(!deliveryDetails){
        return NextResponse.json(
            {
              success: false,
              message: "There is not any delivery details",
            },
            { status: 401 }
          );
    }

    return NextResponse.json(
      {
        success: true,
        message: "deliveryDetails fetched successfully!",
        data: deliveryDetails,
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
        message: "Failed to fetch delivery details",
      },
      { status: 500 }
    );
  }
};
