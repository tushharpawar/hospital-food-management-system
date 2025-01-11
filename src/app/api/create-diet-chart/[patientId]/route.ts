import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest,{params}:{params:{patientId:string}},res:NextResponse) : Promise<NextResponse>{
  try {

    const { dietDetails } = await req.json();
    const patientId = params.patientId

    // Validate required fields
    if (!dietDetails) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required!",
        },
        { status: 400 }
      );
    }

    const pantryStaffExist = await prisma.pantryStaff.findFirst({
      where:{
        contact:dietDetails.staffContact
      }
    })

    if(!pantryStaffExist){
      return NextResponse.json(
        {
          success: false,
          message: "Pantry staff does not exist.",
        },
        { status: 403 }
      );
    }
    //check is meal already exist for this patient

    const mealExistForGivenTime = await prisma.dietChart.findFirst({
      where: {
        patientId,
        mealTime:dietDetails.mealTime
      },
    });

    if(mealExistForGivenTime){
        return NextResponse.json(
            {
              success: false,
              message: "Meal already exist with given meal time for this patient.",
            },
            { status: 402 }
          );
    }

    const newMeal = await prisma.dietChart.create({
      data: {
        mealTime:dietDetails.mealTime,
        ingredients:dietDetails.ingredients,
        instructions:dietDetails.instructions,
        location:dietDetails.location,
        staffContact:dietDetails.staffContact,
        staffName:dietDetails.staffName,
        patient: { connect: { id: patientId } },
      },
    });

    //assigning a task
    const newPantryTask = await prisma.pantryTask.create({
      data:{
        status:'PENDING',
        deliveryPersonnelName:'',
        deliveryPersonnelContact:'',
        deliveryLocation:dietDetails.location,
        dietChart:{connect:{id:newMeal.id}},
        pantryStaff: {connect:{contact:pantryStaffExist.contact}},
      }
    })

    if(!newPantryTask){
      return NextResponse.json(
        {
          success: false,
          message: "Pentry Task not created!",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Meal created successfully!",
        data: newMeal,
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
        message: "Failed to create meal",
      },
      { status: 500 }
    );
  }
};
