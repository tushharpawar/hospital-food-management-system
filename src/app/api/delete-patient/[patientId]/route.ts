import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest,{params}:{params:{patientId:string}},res:NextResponse) => {
  try {
    const {patientId} = await params

    const deletePatientDetails = await prisma.patient.delete({
        where:{
            id:patientId
        }
    })

    if(deletePatientDetails){

        await prisma.dietChart.deleteMany({
            where:{
                patientId
            }
        })

        const dietChart = await prisma.dietChart.findMany({
            where:{patientId}
        })

        await Promise.all(
            dietChart.map(async (chart) => {
                await prisma.pantryTask.deleteMany({
                    where: {
                        dietChartId: chart.id,
                    },
                });
            })
        );

        return NextResponse.json(
            {
              success: true,
              message: "Patient details deleted",
            },
            { status: 202 }
          );
    }else{
        return NextResponse.json(
            {
              success: true,
              message: "Failed to delete patient details",
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
        message: "Failed to delete patient details",
      },
      { status: 500 }
    );
  }
};
