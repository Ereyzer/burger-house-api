export class CreateRoleDto {
  id: string;
  display_name: string;
  description: string | undefined;
  permits: string[] | undefined;
}
