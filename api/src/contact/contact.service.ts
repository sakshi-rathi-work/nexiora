import { Injectable } from '@nestjs/common';
import { ContactRepository } from './contact.repository';
import { CreateContactSubmissionDto } from './dto/create-contact-submission.dto';

@Injectable()
export class ContactService {
  constructor(private readonly contactRepository: ContactRepository) {}

  async submitContactForm(dto: CreateContactSubmissionDto) {
    const submission = await this.contactRepository.createSubmission(dto);

    console.log(
      `\n===================================================\n` +
      `[CONTACT INQUIRY RECEIVED]\n` +
      `From: ${dto.name} (${dto.email})\n` +
      `Subject: ${dto.subject}\n` +
      `Message: ${dto.message}\n` +
      `===================================================\n`
    );

    return {
      message: 'Thank you for reaching out! A NEXIORA talent consultant will get back to you shortly.',
      submissionId: submission.id,
    };
  }
}
