import {  NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  try {

    const pantryTask = await prisma.pantryTask.findMany(
        {
            include:{
            dietChart:true
        }}
    );

    if(!pantryTask){
        return NextResponse.json(
            {
              success: false,
              message: "There is no Pantry Task",
              data: pantryTask,
            },
            { status: 401 }
          );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Pantry Task fetched successfully!",
        data: pantryTask,
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
        message: "Failed to get Pantry Task",
      },
      { status: 500 }
    );
  }
};
