"use client"
import { useEffect, useState, useCallback } from "react"
import { Sidebar } from "@/components/layout/Sidebar/Sidebar"
import { Header } from "@/components/layout/Header/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Search, Shield, Eye, EyeOff, UserCheck, UserX, User, Users, RefreshCw } from "lucide-react"
import { AccountWithDetails, AccountWithRole } from "@/models/models"
import { useNavigate } from "@tanstack/react-router"
import { useSession } from "@/contexts/SessionProvider"
import { useGetAccounts } from "@/hooks/use-accounts"
import { TableLoading, ButtonLoading } from "@/components/loading"
import { toast } from "sonner"
import { Pagination } from "@/components/ui/pagination"

export default function AccountManagement() {
  const { account } = useSession()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<AccountWithDetails | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    setCurrentPage(1)
  }, [roleFilter, statusFilter])

  const { accounts: getAccountsResult, pagination: getAccountPagination, loading: getAccountsLoading, refetch } = useGetAccounts({
    page: currentPage,
    limit: itemsPerPage,
    roleId: roleFilter !== "all" ? roleFilter : undefined,
    searchTerm: debouncedSearchTerm || undefined,
    emailIsVerified: statusFilter === "verified" ? true :
      statusFilter === "unverified" ? false : undefined
  });

  const handleAddAccount = () => {
    setEditingAccount(null)
    setIsDialogOpen(true)
  }

  const handleEditAccount = (account: AccountWithDetails) => {
    setEditingAccount(account)
    setIsDialogOpen(true)
  }

  const handleDeleteAccount = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      try {
        setIsSubmitting(true)
        // Add delete API call here
        toast.success("Xóa tài khoản thành công")
      } catch (error) {
        toast.error("Lỗi khi xóa tài khoản")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleSubmitAccount = async () => {
    try {
      setIsSubmitting(true)
      // Add create/update API call here
      setIsDialogOpen(false)
      toast.success(editingAccount ? "Cập nhật tài khoản thành công" : "Tạo tài khoản thành công")
    } catch (error) {
      toast.error("Lỗi khi lưu tài khoản")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRoleDisplayName = (roleId: string) => {
    switch (roleId) {
      case "1": return "Quản trị viên";
      case "2": return "Nhân viên";
      case "3": return "Người dùng";
      default: return "Không xác định";
    }
  }

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
  }, [])

  const handleRoleFilterChange = useCallback((value: string) => {
    setRoleFilter(value)
  }, [])

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value)
  }, [])

  const clearAllFilters = () => {
    setSearchTerm("")
    setRoleFilter("all")
    setStatusFilter("all")
    setCurrentPage(1)
  }

  const getFilteredAccounts = () => {
    // Since filtering is now handled by the API, just return the accounts
    return getAccountsResult || []
  }

  const filteredAccounts = getFilteredAccounts()
  const hasActiveFilters = searchTerm !== "" || roleFilter !== "all" || statusFilter !== "all"

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={account?.role?.id} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản Lý Tài Khoản</h1>
                <p className="text-gray-600">Quản lý tài khoản người dùng và phân quyền hệ thống</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={refetch} disabled={getAccountsLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${getAccountsLoading ? "animate-spin" : ""}`} />
                  Làm mới
                </Button>
                <Button onClick={handleAddAccount} disabled={isSubmitting}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Tài Khoản
                </Button>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Danh Sách Tài Khoản</CardTitle>
                  <CardDescription>
                    Xem và quản lý tài khoản người dùng hệ thống
                    {getAccountsResult && (
                      <span className="ml-2 text-sm font-medium">
                        ({getAccountsResult.length} tài khoản hiển thị)
                      </span>
                    )}
                  </CardDescription>
                </div>
              </div>

              <div className="space-y-4 mt-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Lọc theo vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả vai trò</SelectItem>
                      <SelectItem value="1">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Quản trị viên
                        </div>
                      </SelectItem>
                      <SelectItem value="2">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4" />
                          Nhân viên
                        </div>
                      </SelectItem>
                      <SelectItem value="3">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Người dùng
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Lọc theo trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="verified">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          Đã xác thực
                        </div>
                      </SelectItem>
                      <SelectItem value="unverified">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                          Chưa xác thực
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveFilters && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Bộ lọc đang áp dụng:</span>
                    {searchTerm && (
                      <Badge variant="secondary" className="gap-1">
                        Tìm kiếm: "{searchTerm}"
                        <button
                          onClick={() => setSearchTerm("")}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {roleFilter !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        Vai trò: {getRoleDisplayName(roleFilter)}
                        <button
                          onClick={() => setRoleFilter("all")}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {statusFilter !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        Trạng thái: {statusFilter === "verified" ? "Đã xác thực" : "Chưa xác thực"}
                        <button
                          onClick={() => setStatusFilter("all")}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-xs"
                    >
                      Xóa tất cả bộ lọc
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {getAccountsLoading ? (
                <TableLoading />
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên đăng nhập</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Số điện thoại</TableHead>
                        <TableHead>Vai trò</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAccounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell className="font-medium">
                            {searchTerm && account.username.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                              <span dangerouslySetInnerHTML={{
                                __html: account.username.replace(
                                  new RegExp(`(${searchTerm})`, 'gi'),
                                  '<mark class="bg-yellow-200">$1</mark>'
                                )
                              }} />
                            ) : (
                              account.username
                            )}
                          </TableCell>
                          <TableCell>
                            {account.email ? (
                              searchTerm && account.email.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                                <span dangerouslySetInnerHTML={{
                                  __html: account.email.replace(
                                    new RegExp(`(${searchTerm})`, 'gi'),
                                    '<mark class="bg-yellow-200">$1</mark>'
                                  )
                                }} />
                              ) : (
                                account.email
                              )
                            ) : (
                              <span className="text-gray-400">Chưa có</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {account.phoneNumber ? (
                              searchTerm && account.phoneNumber.includes(searchTerm) ? (
                                <span dangerouslySetInnerHTML={{
                                  __html: account.phoneNumber.replace(
                                    new RegExp(`(${searchTerm})`, 'gi'),
                                    '<mark class="bg-yellow-200">$1</mark>'
                                  )
                                }} />
                              ) : (
                                account.phoneNumber
                              )
                            ) : (
                              <span className="text-gray-400">Chưa có</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              <Badge variant={
                                account.roleId === "1" ? "default" :
                                  account.roleId === "2" ? "secondary" : "outline"
                              }>
                                {getRoleDisplayName(account.roleId)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={account.emailIsVerified ? "default" : "secondary"}>
                              {account.emailIsVerified ? "Đã xác thực" : "Chưa xác thực"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditAccount(account)}
                                disabled={isSubmitting}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAccount(account.id)}
                                disabled={isSubmitting || account.id === account?.id}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {filteredAccounts.length === 0 && !getAccountsLoading && (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Không tìm thấy tài khoản
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {hasActiveFilters
                          ? "Không có tài khoản nào phù hợp với bộ lọc của bạn."
                          : "Chưa có tài khoản nào trong hệ thống."
                        }
                      </p>
                      {hasActiveFilters && (
                        <Button variant="outline" onClick={clearAllFilters}>
                          Xóa bộ lọc
                        </Button>
                      )}
                    </div>
                  )}

                  {getAccountsResult && getAccountsResult.length > 0 && getAccountPagination && (
                    <Pagination
                      currentPage={getAccountPagination.page}
                      totalPages={getAccountPagination.totalPages}
                      totalItems={getAccountPagination.total}
                      itemsPerPage={getAccountPagination.limit}
                      onPageChange={handlePageChange}
                      onItemsPerPageChange={handleItemsPerPageChange}
                      className="mt-4"
                    />
                  )}
                </>
              )}

              {getAccountsResult?.length === 0 && !getAccountsLoading && (
                <div className="text-center py-8 text-gray-500">
                  Không tìm thấy tài khoản nào
                </div>
              )}
            </CardContent>
          </Card>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingAccount ? "Chỉnh Sửa Tài Khoản" : "Thêm Tài Khoản Mới"}
                </DialogTitle>
                <DialogDescription>
                  {editingAccount ? "Cập nhật thông tin tài khoản" : "Tạo tài khoản người dùng mới"}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Tên đăng nhập *</Label>
                  <Input
                    id="username"
                    defaultValue={editingAccount?.username}
                    placeholder="Nhập tên đăng nhập"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={editingAccount?.email}
                    placeholder="Nhập địa chỉ email"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">Số điện thoại</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    defaultValue={editingAccount?.phoneNumber}
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Mật khẩu {editingAccount ? "" : "*"}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={editingAccount ? "Để trống nếu không thay đổi" : "Nhập mật khẩu"}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button
                  type="submit"
                  onClick={handleSubmitAccount}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ButtonLoading message={editingAccount ? "Đang cập nhật..." : "Đang tạo..."} />
                  ) : (
                    editingAccount ? "Cập Nhật" : "Tạo Tài Khoản"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}