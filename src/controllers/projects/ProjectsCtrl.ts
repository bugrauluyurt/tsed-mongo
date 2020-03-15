import { Controller } from "@tsed/common";
import { CalendarsService } from "../../services/calendars/CalendarsService";

/**
 * Add @Controller annotation to declare your class as Router controller.
 * The first param is the global path for your controller.
 * The others params is the controller dependencies.
 *
 * In this case, EventsCtrl is a dependency of CalendarsCtrl.
 * All routes of EventsCtrl will be mounted on the `/calendars` path.
 */
@Controller("/projects")
export class CalendarsCtrl {
    constructor(private projectsService: CalendarsService) {
    }
}
