import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  try {

    const { dietChartId } = await req.json();

    const deletePatientDetails = await prisma.dietChart.delete({
        where:{
            id:dietChartId
        },
    })

    if(deletePatientDetails){
        const pantryTask=await prisma.pantryTask.findFirst({
            where:{
                dietChartId
            }
        })

        await prisma.pantryTask.deleteMany({
            where:{dietChartId}
        })

        await prisma.deliveryTask.deleteMany({
            where:{pantryTaskId:pantryTask?.id}
        })

        return NextResponse.json(
            {
              success: true,
              message: "DietChart details deleted",
            },
            { status: 202 }
          );
    }else{
        return NextResponse.json(
            {
              success: true,
              message: "Failed to delete diet chart details",
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
        message: "Failed to delete diet chart details",
      },
      { status: 500 }
    );
  }
};
