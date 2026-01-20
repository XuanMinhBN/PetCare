/**
 * Định nghĩa các hằng số cho vai trò người dùng để tránh gõ sai.
 * Tên các quyền (role) này nên khớp với những gì backend trả về.
 */
export const ROLES = {
  ADMIN: "ROLE_ADMIN",
  STAFF: "ROLE_STAFF",
  CUSTOMER: "ROLE_CUSTOMER",
};

/**
 * Một bộ công cụ (utility) để kiểm tra vai trò của người dùng một cách an toàn và linh hoạt.
 * Nó có thể kiểm tra vai trò từ nhiều thuộc tính khác nhau như:
 * user.role, user.roles, user.authorities, user.auth
 */
export const RoleUtils = {
  /**
   * Hàm lõi để kiểm tra xem người dùng có một vai trò cụ thể hay không.
   * @param {object} user - Đối tượng người dùng.
   * @param {string} requiredRole - Vai trò cần kiểm tra (ví dụ: ROLES.ADMIN).
   * @returns {boolean} - Trả về true nếu người dùng có vai trò đó.
   */
  hasRole: (user, requiredRole) => {
    if (!user || !requiredRole) {
      return false;
    }

    // Danh sách các thuộc tính có thể chứa thông tin vai trò
    const potentialRoleHolders = [
      user.role,
      user.roles,
      user.authorities,
      user.auth,
    ];

    for (const holder of potentialRoleHolders) {
      if (!holder) {
        continue; // Bỏ qua nếu thuộc tính không tồn tại hoặc null
      }

      // Nếu thuộc tính là một mảng, kiểm tra xem nó có chứa vai trò cần tìm không
      if (Array.isArray(holder) && holder.includes(requiredRole)) {
        return true;
      }

      // Nếu thuộc tính là một chuỗi, kiểm tra xem nó có bằng chính xác vai trò đó không
      if (typeof holder === "string" && holder === requiredRole) {
        return true;
      }
    }

    // Nếu không tìm thấy ở đâu cả, trả về false
    return false;
  },

  /**
   * Kiểm tra xem người dùng có phải là Admin hay không.
   * @param {object} user - Đối tượng người dùng.
   * @returns {boolean}
   */
  isAdmin: (user) => RoleUtils.hasRole(user, ROLES.ADMIN),

  /**
   * Kiểm tra xem người dùng có phải là Customer hay không.
   * @param {object} user - Đối tượng người dùng.
   * @returns {boolean}
   */
  isCustomer: (user) => RoleUtils.hasRole(user, ROLES.CUSTOMER),

  /**
   * Kiểm tra xem người dùng có phải là Staff (nhân viên) hay không.
   * @param {object} user - Đối tượng người dùng.
   * @returns {boolean}
   */
  isStaff: (user) => RoleUtils.hasRole(user, ROLES.STAFF),
};
