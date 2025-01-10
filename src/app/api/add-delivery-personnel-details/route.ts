import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  try {

    const { deliveryPersonnelName,deliveryPersonnelContact,deliveryTime, deliveryNote,pantryContact } = await req.json();

    const pantryTask = await prisma.pantryTask.findFirst({
      where:{
        pantryStaffContact:pantryContact
      }
    })

    if(!pantryTask){
      return NextResponse.json(
        {
          success: false,
          message: "Pantry staff does not exist",
        },
        { status: 404 }
      );
    }

    const updateDeliveryPersonnelDetails = await prisma.pantryTask.update({
      data: {
        deliveryPersonnelName,
        deliveryPersonnelContact,
        deliveryTime
      },
      where: {
        id:pantryTask.id
      }
    })

    //assign delivery task

    const newDeliveryTask = await prisma.deliveryTask.create({
      data: {
        status: 'ON_THE_WAY',
        deliveryLocation: updateDeliveryPersonnelDetails.deliveryLocation,
        notes: deliveryNote,
        deliveryTime: updateDeliveryPersonnelDetails.deliveryTime,
        deliveryPersonnel: { connect: { contact: updateDeliveryPersonnelDetails.deliveryPersonnelContact } },
        pantryTask:{connect:{id:pantryTask.id}}
      },
    })
    
    if(updateDeliveryPersonnelDetails && newDeliveryTask){
      return NextResponse.json(
        {
          success: true,
          message: "Delivery details updated",
        },
        { status: 202 }
      );
    }else{
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update delivery details.",
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
        message: "Failed to update delivery details",
      },
      { status: 500 }
    );
  }
};
