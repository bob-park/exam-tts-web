type RoleType = 'ROLE_ADMIN' | 'ROLE_MANAGER' | 'ROLE_USEr';

interface Role {
  id: number;
  type: RoleType;
  description?: string;
}

interface User {
  uniqueId: string;
  userId: string;
  username: string;
  email: string;
  phone?: string;
  cellPhone?: string;
  role: Role;
  createdDate: Date;
  createdBy: string;
  lastModifiedDate?: Date;
  lastModifiedBy?: string;
}
