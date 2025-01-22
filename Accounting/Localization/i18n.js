import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

i18n.use(LanguageDetector).use(initReactI18next).init({
    debug: true,
    fallbacklng: "en",
    resources: {
        en: {
            translation: {
                //--- Global Vars---//
                back: "Back",
                //--- Global User Vars---//
                password: "Password",
                signUp: "Sign Up",
                userName: "User Name",
                email: "Email",
                confirmPassword: "Confirm Password",
                logout: "Logout",
                //---Login---//
                login: "Login",
                emailOrUserName: "Email or User Name",
                forgotPassword: "Forgot Password",
                //---Register---//
                resetcode: "Your Reset Code is",
                dontLoseIt: "Dont Lose It",
                //---Reset Password---//
                resetPassword: "Reset Password",
                resetPasswordCode: "Reset Code",
                newPassword: "New Password",
                reset: "Reset",

                //---Global Accounting Vars---//
                sellSupplies: "Sell Supplies",
                sell: "Sell",

                customers: "Customers",
                customer: "Customer",
                addCustomer: "Add Customer",
                totalDebt: "Total Debt",

                sellCustomer: "Sell Customer",
                debt: "Debt",
                paid: "paid",
                sellCustomerbtn: "Sell Customer",

                moneyIncome: "Money Income",
                addIncome: "Add Income",

                payment: "Payment",
                reason: "Reason",
                pay: "Pay",

                types: "Types",
                addType: "Add Type",

                supplies: "Supplies",
                unit: "Unit",
                kg: "Kgram",
                gram: "gram",
                peace: "Piece",
                addSupply: "Add Supply",

                dispatchSupplies: "Dispatch Supplies",
                dispatch: "Dispatch",

                buySupplies: "Buy Supplies",
                buy: "Buy",

                employees: "Employees",
                employeeName: "Employee Name",
                salary: "Salary",
                employ: "Employ",

                buyPrice: "Buy Price",
                sellPrice: "Sell Price",

                addedSuccessfully: "added Successfully",
                type: "Type",
                supply: "Supply",
                countity: "Countity",
                price: "Price",
                total: "Total",
                date: "Date",
                notes: "Notes",
                actions: "Actions",
                search: "Search",
                refresh: "Refresh",
                edit: "Edit",
                save: "Save",
                delete: "Delete",

                generate: "Generate",
                startDate: "Start Date",
                endDate: "End Date",
                inventory: "Inventory",
                show: 'Show',

                initialCountity: "Initial Countity",
                finalCountity: "Final Countity",
                initialFund: "Initial Fund",
                finalFund: "Final Fund",
                salesCountity: "Sales Countity",
                purchaseCountity: "Purchase Countity",
                debtCountity: "Debt Countity",
                unPaidCustomers: "Unpaid Customers",
                discrepancy: "Discrepancy",
                dispatchedSupply: "Dispatched Supply",
                dispatchedValue: "Dispatched Value",
                inventoryDate: "Inventory Date",

                close: "Close",

                setupAccount: "SetUp Your Account",
                enterBudget: "Enter Budget (Required)",
                insertTypes: "Insert Types (Not Required)",
                insertExistingCustomer: "Insert Existing Customer Names (Not Required)",
                insertExistingEmployees: "Insert Existing Employees (Not Required)",

                submit: "Submit",

                sellsFund: "Sells Fund",
                moveToPerma: "Move to Perma Fund",
                permaFund: "Permanant Fund",

                reset: "Reset",
                calculate: "Calculate",

                passwordmatcherror: "Password Does Not Match",

                passwordRegixError: `Password Must be at least 8 characters long, at least one uppercase letter
                                    at least one lowercase letter, at least one digit and  least one special character.`,

                options: "Options",

                downloadData:"Download Data",

                excel:"Excel",
                pdf:"PDF",
            }
        },
        ar: {
            translation: {
                //--- Global Vars---//
                back: "العودة",
                //--- Global User Vars---//
                password: "كلمة المرور",
                signUp: "انشاء حساب",
                userName: "اسم المستخدم",
                email: "البريد",
                confirmPassword: "تاكيد كلمة المرور",
                logout: "تسجيل خروج",
                //---Login---//
                login: "تسجيل الدخول",
                emailOrUserName: "البريد او اسم المستخدم",
                forgotPassword: "نسيت كلمة المرور",
                //---Register---//
                resetcode: "رمز اعادة التفعيل",
                dontLoseIt: "لا تخسره",
                //---Reset Passowrd---//
                resetPassword: "تغيير كلمة المرور",
                resetPasswordCode: "رمز التغيير",
                newPassword: "كلمة المرور الجديدة",
                reset: "تغيير",

                //---Global Accounting Vars---//
                sellSupplies: "بيع سلعة",
                addedSuccessfully: "اضيف بنجاح",

                customers: "الزبائن",
                customer: "الزبون",
                addCustomer: "اضافة زبون",
                totalDebt: "اجمالي الديون",

                sellCustomer: "بيع زبون",
                debt: "دين",
                paid: "تم دفع",
                sellCustomerbtn: "بيع زبون",

                moneyIncome: "المقبوضات",
                addIncome: "أضافة مقبوض",

                payment: "المدفوعات",
                reason: "السبب",
                pay: "ادفع",

                types: "الاصناف",
                addType: "اضافة صنف",

                supplies: "البضائع",
                Unit: "الوحدة",
                Kgram: "كيلو",
                Gram: "غرام",
                Piece: "قطعة",
                addSupply: "اضافة",

                dispatchSupplies: "اخراج بضاعة",
                dispatch: "اخراج",

                buySupplies: "شراء بضاعة",
                buy: "شراء",

                employees: "الموظفين",
                employeeName: "اسم الموظف",
                salary: "الراتب",
                employ: "توظيف",

                buyPrice: "سعر الشراء",
                sellPrice: "سعر البيع",

                sell: "تاكيد",
                type: "الصنف",
                supply: "السلعة",
                countity: "الكمية",
                price: "السعر",
                total: "الاجمالي",
                date: "التاريخ",
                notes: "ملاحظات",
                actions: "وظائف",
                search: "بحث",
                refresh: "تحديث",
                edit: "تعديل",
                save: "حفظ",
                delete: "حذف",

                generate: "توليد",
                startDate: "تاريخ البدء",
                endDate: "التاريخ النهائي",
                inventory: "الجرد",
                show: 'اظهار',

                initialCountity: "الكمية الاولية",
                finalCountity: "الكمية النهائية",
                initialFund: "الصندوق الاولي",
                finalFund: "الصندوق النهائي",
                salesCountity: "كمية المبيعات",
                purchaseCountity: "كمية المشتريات",
                debtCountity: "الكمية المدينة",
                unPaidCustomers: "الزبائن المدينين",
                discrepancy: "النقص",
                dispatchedSupply: "البضاعة المخرجة",
                dispatchedValue: "قيمة الاخراج",
                inventoryDate: "تاريخ الجرد",

                close: "اغلاق",

                setupAccount: "جهز حسابك",
                enterBudget: "ادخل راس المال (مطلوب)",
                insertTypes: "ادخل الاصناف (مطلوب)",
                insertExistingCustomer: "ادخل الزبائن الموجودين (غير مطلوب)",
                insertExistingEmployees: "ادخل الموظفين الموجودين (غير مطلوب)",

                submit: "تاكيد",

                sellsFund: "صندوق المبيعات",
                moveToPerma: "نقل الى صندوق الدائم",
                permaFund: "الصندوق الدائم",

                reset: "مسح الكل",
                calculate: "حساب",

                passwordmatcherror: "حقلا كلمة المرور غير متطابقان",

                passwordRegixError: `كلمة المرور يجب أن تكون مكونة من 8 أحرف على الأقل، تحتوي على حرف كبير واحد على الأقل، وحرف صغير واحد على الأقل، ورقم واحد على الأقل، و رمز واحد على الأقل`,

                options: "اعدادات",

                downloadData:"تحميل البيانات",

                excel:"ملف اكسل",
                pdf:"ملف PDF",
            }
        }
    }
})