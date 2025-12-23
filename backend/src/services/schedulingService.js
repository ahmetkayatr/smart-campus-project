const { Classroom } = require('../models');

class SchedulingService {
    static async generateSchedule(sections) {
        const timeSlots = this.generateTimeSlots();
        const classrooms = await Classroom.findAll({ where: { is_active: true } }); // isActive -> is_active
        const assignments = [];

        for (const section of sections) {
            let assigned = false;
            for (const slot of timeSlots) {
                for (const classroom of classrooms) {
                    if (await this.canAssign(section, slot, classroom, assignments, sections)) {
                        assignments.push({
                            section_id: section.id, // sectionId -> section_id
                            classroom_id: classroom.id,
                            day_of_week: slot.day,
                            start_time: slot.start,
                            end_time: slot.end
                        });
                        assigned = true;
                        break;
                    }
                }
                if (assigned) break;
            }
            if (!assigned) {
                throw new Error(`Ders yerleþtirilemedi: ${section.Course?.code || section.id}`);
            }
        }
        return assignments;
    }

    static generateTimeSlots() {
        const slots = [];
        const days = [1, 2, 3, 4, 5];
        const hours = ['09:00', '11:00', '13:00', '15:00'];
        for (const day of days) {
            for (const start of hours) {
                const [h, m] = start.split(':');
                const end = `${String(parseInt(h) + 2).padStart(2, '0')}:${m}`;
                slots.push({ day, start, end });
            }
        }
        return slots;
    }

    static async canAssign(section, slot, classroom, assignments, sections) {
        if (classroom.capacity < section.capacity) return false;

        const classroomConflict = assignments.some(a =>
            a.classroom_id === classroom.id &&
            a.day_of_week === slot.day &&
            this.timesOverlap(a.start_time, a.end_time, slot.start, slot.end)
        );
        if (classroomConflict) return false;

        const instructorConflict = assignments.some(a => {
            const otherSection = sections.find(s => s.id === a.section_id);
            return otherSection?.instructor_id === section.instructor_id &&
                a.day_of_week === slot.day &&
                this.timesOverlap(a.start_time, a.end_time, slot.start, slot.end);
        });
        return !instructorConflict;
    }

    static timesOverlap(start1, end1, start2, end2) {
        return start1 < end2 && start2 < end1;
    }
}

module.exports = SchedulingService;