import {  NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req:NextRequest,{params}:{params:{patientId:string}},res:NextResponse) => {

  try {
    const patientId = await params.patientId

    const dietCharts = await prisma.dietChart.findMany({
        where:{
            patientId
        },
        include:{
            PantryTask:true,
        }
    });

    if(!dietCharts){
        return NextResponse.json(
            {
              success: false,
              message: "There are no diet chart",
            },
            { status: 401 }
          );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Diet charts fetched successfully!",
        data: dietCharts,
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
        message: "Failed to get dietCharts",
      },
      { status: 500 }
    );
  }
};
