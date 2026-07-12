const roleRepository = require('../repositories/roleRepository');

class RoleService {
  async getAllRoles() {
    return await roleRepository.findAll();
  }

  async getAllPermissions() {
    return await roleRepository.findAllPermissions();
  }

  async getRoleById(id) {
    const role = await roleRepository.findById(id);
    if (!role) {
      throw new Error('Role not found');
    }
    const permissions = await roleRepository.findPermissionsByRoleId(id);
    role.permissions = permissions;
    return role;
  }

  async updateRolePermissions(roleId, permissionIds) {
    const role = await roleRepository.findById(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    // Verify all permission ids exist in database
    const allPerms = await roleRepository.findAllPermissions();
    const allPermIds = allPerms.map(p => p.id);
    const invalidIds = permissionIds.filter(id => !allPermIds.includes(parseInt(id, 10)));
    
    if (invalidIds.length > 0) {
      throw new Error(`Invalid permission IDs: ${invalidIds.join(', ')}`);
    }

    return await roleRepository.updateRolePermissions(roleId, permissionIds.map(id => parseInt(id, 10)));
  }
}

module.exports = new RoleService();
