// app/api/generate-report/route.ts
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Add await here
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { tasks: true }
    })

    // Rest of the PDF generation code remains the same
    const pdfDoc = await PDFDocument.create()
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const page = pdfDoc.addPage([600, 800])
    const { height } = page.getSize()

    // Header
    page.setFont(helveticaFont)
    page.setFontSize(20)
    page.drawText(`${user?.industry} Compliance Report`, {
      x: 50,
      y: height - 50,
    })

    // Tasks List
    let yPosition = height - 80
    page.setFontSize(12)
    user?.tasks.forEach(task => {
      page.drawText(`${task.isCompleted ? '✓' : '✗'} ${task.title} - Due: ${new Date(task.dueDate).toLocaleDateString()}`, {
        x: 50,
        y: yPosition,
      })
      yPosition -= 20
    })

    // Finalize PDF
    const pdfBytes = await pdfDoc.save()
    const pdfBuffer = Buffer.from(pdfBytes)

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=compliance-report.pdf'
      }
    })
  } catch (error) {
    console.error('PDF Generation Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' }, 
      { status: 500 }
    )
  }
}