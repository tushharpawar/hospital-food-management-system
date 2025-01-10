import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest,{params}:{params:{dietChartId:string}}) => {
  try {

    const { dietDetails } = await req.json();

    const {dietChartId} = await params

    const updateDietChartDetails = await prisma.dietChart.update({
      data: {
        mealTime:dietDetails.mealTime,
        ingredients:dietDetails.ingredients,
        instructions:dietDetails.instructions,
        location:dietDetails.location
      },
      where: {
        id:dietChartId
      }
    })

    if(updateDietChartDetails){
        return NextResponse.json(
            {
              success: true,
              message: "DietChart Details updated",
            },
            { status: 202 }
          );
    }else{
        return NextResponse.json(
            {
              success: true,
              message: "Failed to update DietChart Details",
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
        message: "Failed to update DietChart Details",
      },
      { status: 500 }
    );
  }
};
