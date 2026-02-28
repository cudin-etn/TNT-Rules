import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['vi', 'en'], // Các ngôn ngữ hỗ trợ
  defaultLocale: 'vi'    // Ngôn ngữ mặc định
});

// Xuất các hàm điều hướng chuẩn để sau này dùng thay thế cho next/link và next/router
export const {Link, redirect, usePathname, useRouter, getPathname} = createNavigation(routing);