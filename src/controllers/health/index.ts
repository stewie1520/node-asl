import { Controller, Get, Route, Tags } from "tsoa";

@Route("health")
@Tags("health")
export class HealthController extends Controller {
  @Get("/ready")
  public async ready() {
    return {
      status: "ok",
    };
  }

  @Get("/live")
  public async live() {
    return {
      status: "ok",
    };
  }
}
