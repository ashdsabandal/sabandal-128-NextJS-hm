import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/db';
import { Plant } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
    const id = (await params).id;
    const plant = await db.findUnique(id);

    if (plant) {
        return NextResponse.json(
            {
                data: plant,
                message: "Plant retrieved successfully",
            }
        );
    }

    return NextResponse.json({ error: `Plant with ID ${id} not found`}, { status: 404 });
}
 
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
    const id = (await params).id;
    try {
        const body = await request.json();

        if (!body.lastWatered && !body.status) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        const updateInfo: Partial<Plant> = body;

        const plant = await db.update(id, updateInfo);

        if (plant) {
            return NextResponse.json({ data: plant }, { status: 201 });
        }

        return NextResponse.json({ error: `Plant with ID ${id} not found`}, { status: 404 });

    } catch (err) {
        return NextResponse.json({ error: 'Invalid Request'}, { status: 400 });
    }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
    const id = (await params).id;
    const deleted = await db.delete(id);

    if (deleted) {
        return NextResponse.json(
            {
                message: "Plant deleted successfully",
            }
        );
    }

    return NextResponse.json({ error: `Plant with ID ${id} not found`}, { status: 404 });
}