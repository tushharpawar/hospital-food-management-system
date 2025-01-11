import {  NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  try {

    const deliveryTask = await prisma.deliveryTask.findMany();

    if(!deliveryTask){
        return NextResponse.json(
            {
              success: false,
              message: "There is no Delivery Task",
              data: deliveryTask,
            },
            { status: 404 }
          );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Delivery Task fetched successfully!",
        data: deliveryTask,
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
        message: "Failed to get Delivery Task",
      },
      { status: 500 }
    );
  }
};
