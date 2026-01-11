import {
    // Arrows & Chevrons
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    ChevronsUpDown,
    ChevronsLeft,
    ChevronsRight,
    ArrowDown,
    ArrowUp,
    ArrowLeft,
    ArrowRight,
    ArrowRightLeft,
    ArrowUpDown,
    ArrowUpRight,
    ArrowDownLeft,
    TrendingUp,
    TrendingDown,
    RefreshCw,
    RotateCcw,
    ExternalLink,
    Maximize2,
    Minimize2,

    // Actions
    Plus,
    PlusCircle,
    CirclePlus,
    Minus,
    X,
    XCircle,
    Trash,
    Trash2,
    Edit,
    Edit2,
    Edit3,
    Save,
    Download,
    DownloadCloud,
    Upload,
    Search,
    FileSearch,
    Filter,
    MoreHorizontal,
    MoreVertical,
    Check,
    CheckCheck,
    CheckCircle,
    CheckCircle2,
    CircleCheck,
    CheckSquare,
    Copy,
    Share,
    Share2,
    LogOut,
    Settings,
    Settings2,
    Menu,
    Grid,
    List,
    ListTodo,
    Sliders,
    SlidersHorizontal,
    GripVertical,
    Paperclip,
    Mic,
    MicOff,
    Send,
    Play,
    Pause,
    History,
    Ellipsis,
    Wrench,
    PanelRightClose,
    PanelRightOpen,
    Flag,
    Bookmark,
    Pin,
    Link2,
    Unlink,
    Printer,
    Archive,
    Reply,
    ReplyAll,
    Forward,
    Inbox,
    Square,
    SquareTerminal,

    // Entities & Objects
    User,
    Users,
    UserPlus,
    UserCheck,
    UserX,
    CircleUser,
    CircleUserRound,
    Building,
    Building2,
    CreditCard,
    Wallet,
    WalletMinimal,
    Coins,
    DollarSign,
    CircleDollarSign,
    BadgeDollarSign,
    HandCoins,
    PiggyBank,
    Briefcase,
    BriefcaseBusiness,
    Calendar,
    CalendarDays,
    CalendarCheck,
    CalendarCheck2,
    CalendarClock,
    Clock,
    Clock12,
    Timer,
    File,
    FileText,
    FileEdit,
    FilePlus,
    FileClock,
    Folder,
    FolderOpen,
    FolderPlus,
    FolderKanban,
    Image as ImageIcon, // Alias to avoid conflict with HTML Image
    LayoutGrid,
    LayoutDashboard,
    PieChart,
    BarChart,
    BarChart2,
    BarChart3,
    BarChart4,
    AreaChart,
    LineChart,
    ChartBarDecreasing,
    ChartPie,
    Activity,
    Bell,
    Mail,
    Phone,
    PhoneCall,
    PhoneMissed,
    MapPin,
    Navigation,
    Globe,
    Home,
    Laptop,
    Smartphone,
    Sun,
    Moon,
    Loader2,
    AlertCircle,
    CircleAlert,
    AlertTriangle,
    Info,
    HelpCircle,
    Lock,
    Unlock,
    Eye,
    EyeOff,
    Terminal,
    Code,
    Sparkles,
    Brain,
    Rocket,
    Zap,
    Star,
    StarOff,
    Heart,
    ThumbsUp,
    ThumbsDown,
    Smile,
    MessageSquare,
    MessageSquarePlus,
    MessageCircle,
    MessageCircleReply,
    Bot,
    Compass,
    Library,
    Crown,
    Wand2,
    Palette,
    Megaphone,
    Target,
    MousePointer,
    ShoppingCart,
    ShoppingBag,
    ShoppingBasket,
    Package,
    Package2,
    Truck,
    Headphones,
    Tag,
    BookOpen,
    Car,
    Coffee,
    Store,
    Receipt,
    Lightbulb,
    ClipboardMinus,
    PenSquare,
    Pencil,
    Columns,
    Layers2,
    Container,
    Atom,
    Cat,
    ShipWheel,
    TreePalm,
    Video,
    Music,
    HardDrive,
    Cloud,
    Calculator,
    Percent,
    Ticket,
    Utensils,
    Dumbbell,
    Flower2,
    Footprints,
    Flame,
    Droplet,
    Award,
    Trophy,
    BadgeCheck,
    GitBranch,
    Dribbble,
    Facebook,
    Instagram,
    Linkedin,
    Sheet as SheetIcon,
    Languages,
    MoveRight,
    Mouse,
    Shield,
    Bitcoin,
    Table,
    Proportions,
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    Images,
    SquareCheck,
    Hospital,
    Circle,
    CircleOff,
    Hand,
    ArchiveRestore,
    BrainCircuit,
    ClipboardCheck,
    Clipboard,
    Component,
    Cookie,
    Fingerprint,
    FolderDot,
    Gauge,
    GraduationCap,
    Key,
    MessageSquareHeart,
    StickyNote,
    Github,
    RedoDot,
    Brush,
    ShieldAlert,
    FolderUp,
    Type,
    Speech,
    BookA,
    Puzzle,
    PanelLeft,
    Command
} from "lucide-react";

/**
 * CENTRAL ICON VAULT
 * ------------------
 * This file is the ONLY place where `lucide-react` should be imported.
 * All components in the application should import icons from here.
 * 
 * Benefits:
 * 1. Isolates us from upstream breaking changes (renames).
 * 2. Provides back-compatibility (aliasing Icon suffixes).
 * 3. Centralizes logic for icon replacement if we switch libraries.
 */

// 1. Export Standard Names (Modern Lucide)
export {
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    ChevronsUpDown,
    ChevronsLeft,
    ChevronsRight,
    ArrowDown,
    ArrowUp,
    ArrowLeft,
    ArrowRight,
    ArrowRightLeft,
    ArrowUpDown,
    ArrowUpRight,
    ArrowDownLeft,
    TrendingUp,
    TrendingDown,
    RefreshCw,
    RotateCcw,
    ExternalLink,
    Maximize2,
    Minimize2,
    Plus,
    PlusCircle,
    CirclePlus,
    Minus,
    X,
    XCircle,
    Trash,
    Trash2,
    Edit,
    Edit2,
    Edit3,
    Save,
    Download,
    DownloadCloud,
    Upload,
    Search,
    FileSearch,
    Filter,
    MoreHorizontal,
    MoreVertical,
    Check,
    CheckCheck,
    CheckCircle,
    CheckCircle2,
    CircleCheck,
    CheckSquare,
    Copy,
    Share,
    Share2,
    LogOut,
    Settings,
    Settings2,
    Menu,
    Grid,
    List,
    ListTodo,
    Sliders,
    SlidersHorizontal,
    GripVertical,
    Paperclip,
    Mic,
    MicOff,
    Send,
    Play,
    Pause,
    History,
    Ellipsis,
    Wrench,
    PanelRightClose,
    PanelRightOpen,
    Flag,
    Bookmark,
    Pin,
    Link2,
    Unlink,
    Printer,
    Archive,
    Reply,
    ReplyAll,
    Forward,
    Inbox,
    Square,
    SquareTerminal,
    User,
    Users,
    UserPlus,
    UserCheck,
    UserX,
    CircleUser,
    CircleUserRound,
    Building,
    Building2,
    CreditCard,
    Wallet,
    WalletMinimal,
    Coins,
    DollarSign,
    CircleDollarSign,
    BadgeDollarSign,
    HandCoins,
    PiggyBank,
    Briefcase,
    BriefcaseBusiness,
    Calendar,
    CalendarDays,
    CalendarCheck,
    CalendarCheck2,
    CalendarClock,
    Clock,
    Clock12,
    Timer,
    File,
    FileText,
    FileEdit,
    FilePlus,
    FileClock,
    Folder,
    FolderOpen,
    FolderPlus,
    FolderKanban,
    ImageIcon,
    LayoutGrid,
    LayoutDashboard,
    PieChart,
    BarChart,
    BarChart2,
    BarChart3,
    BarChart4,
    AreaChart,
    LineChart,
    ChartBarDecreasing,
    ChartPie,
    Activity,
    Bell,
    Mail,
    Phone,
    PhoneCall,
    PhoneMissed,
    MapPin,
    Navigation,
    Globe,
    Home,
    Laptop,
    Smartphone,
    Sun,
    Moon,
    Loader2,
    AlertCircle,
    CircleAlert,
    AlertTriangle,
    Info,
    HelpCircle,
    Lock,
    Unlock,
    Eye,
    EyeOff,
    Terminal,
    Code,
    Sparkles,
    Brain,
    Rocket,
    Zap,
    Star,
    StarOff,
    Heart,
    ThumbsUp,
    ThumbsDown,
    Smile,
    MessageSquare,
    MessageSquarePlus,
    MessageCircle,
    MessageCircleReply,
    Bot,
    Compass,
    Library,
    Crown,
    Wand2,
    Palette,
    Megaphone,
    Target,
    MousePointer,
    ShoppingCart,
    ShoppingBag,
    ShoppingBasket,
    Package,
    Package2,
    Truck,
    Headphones,
    Tag,
    BookOpen,
    Car,
    Coffee,
    Store,
    Receipt,
    Lightbulb,
    ClipboardMinus,
    PenSquare,
    Pencil,
    Columns,
    Layers2,
    Container,
    Atom,
    Cat,
    ShipWheel,
    TreePalm,
    Video,
    Music,
    HardDrive,
    Cloud,
    Calculator,
    Percent,
    Ticket,
    Utensils,
    Dumbbell,
    Flower2,
    Footprints,
    Flame,
    Droplet,
    Award,
    Trophy,
    BadgeCheck,
    GitBranch,
    Dribbble,
    Facebook,
    Instagram,
    Linkedin,
    SheetIcon,
    Languages,
    MoveRight,
    Mouse,
    Shield,
    Bitcoin,
    Table,
    Proportions,
    Images,
    SquareCheck,
    Hospital,
    Circle,
    CircleOff,
    Hand,
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    ArchiveRestore,
    BrainCircuit,
    ClipboardCheck,
    Clipboard,
    Component,
    Cookie,
    Fingerprint,
    FolderDot,
    Gauge,
    GraduationCap,
    Key,
    MessageSquareHeart,
    StickyNote,
    Github,
    RedoDot,
    Brush,
    ShieldAlert,
    FolderUp,
    Type,
    Speech,
    BookA,
    Puzzle,
    PanelLeft,
    Command
};

// 2. Export Legacy Aliases (Back-compatibility for templates expecting 'Icon' suffix)
export const ChevronDownIcon = ChevronDown;
export const ChevronUpIcon = ChevronUp;
export const ChevronLeftIcon = ChevronLeft;
export const ChevronRightIcon = ChevronRight;
export const ChevronsUpDownIcon = ChevronsUpDown;
export const ChevronsDownIcon = ChevronDown; // Mapping missing alias
export const ArrowDownIcon = ArrowDown;
export const ArrowUpIcon = ArrowUp;
export const ArrowLeftIcon = ArrowLeft;
export const ArrowRightIcon = ArrowRight;
export const PlusIcon = Plus;
export const PlusCircleIcon = PlusCircle;
export const CirclePlusIcon = CirclePlus;
export const SearchIcon = Search;
export const MenuIcon = Menu;
export const CheckIcon = Check;
export const CheckCircleIcon = CheckCircle;
export const XIcon = X;
export const TrashIcon = Trash;
export const Trash2Icon = Trash2;
export const EditIcon = Edit;
export const Edit3Icon = Edit3;
export const SettingsIcon = Settings;
export const UserIcon = User;
export const UsersIcon = Users;
export const UserPlusIcon = UserPlus;
export const CalendarIcon = Calendar;
export const ClockIcon = Clock;
export const Clock12Icon = Clock12;
export const HomeIcon = Home;
export const MailIcon = Mail;
export const PhoneIcon = Phone;
export const BellIcon = Bell;
export const LayoutGridIcon = LayoutGrid;
export const PieChartIcon = PieChart;
export const BarChartIcon = BarChart;
export const BarChart3Icon = BarChart3;
export const FileIcon = File;
export const FolderIcon = Folder;
export const LockIcon = Lock;
export const EyeIcon = Eye;
export const EyeOffIcon = EyeOff;
export const AlertCircleIcon = AlertCircle;
export const CircleAlertIcon = CircleAlert;
export const InfoIcon = Info;
export const Loader2Icon = Loader2;
export const StarIcon = Star;
export const GitBranchIcon = GitBranch;
export const CalendarCheck2Icon = CalendarCheck2;
export const CalendarClockIcon = CalendarClock;
export const BrainIcon = Brain;
export const DribbbleIcon = Dribbble;
export const GlobeIcon = Globe;
export const MicIcon = Mic;
export const SquareIcon = Square;
export const ThumbsDownIcon = ThumbsDown;
export const ThumbsUpIcon = ThumbsUp;
export const PhoneMissedIcon = PhoneMissed;
export const PlayIcon = Play;
export const TrendingUpIcon = TrendingUp;
export const TrendingDownIcon = TrendingDown;
export const WalletIcon = Wallet;
export const FileTextIcon = FileText;
export const DollarSignIcon = DollarSign;
export const BookOpenIcon = BookOpen;
export const CoffeeIcon = Coffee;
export const StoreIcon = Store;
export const SlidersHorizontalIcon = SlidersHorizontal;
export const ArchiveIcon = Archive;
export const FileSearchIcon = FileSearch;
export const ListIcon = List;
export const FilterIcon = Filter;
export const HandCoinsIcon = HandCoins;
export const HeartIcon = Heart;
export const Layers2Icon = Layers2;
export const UploadIcon = Upload;
export const ColumnsIcon = Columns;
export const BadgeCheckIcon = BadgeCheck;
export const BriefcaseBusinessIcon = BriefcaseBusiness;
export const Link2Icon = Link2;
export const ContrastIcon = Sun;
export const PaletteIcon = Palette;
export const ShieldIcon = Shield;
export const PencilIcon = Pencil;
export const RefreshCwIcon = RefreshCw;
export const ShoppingCartIcon = ShoppingCart;
export const CreditCardIcon = CreditCard;
export const MoreVerticalIcon = MoreVertical;
export const AreaChartIcon = AreaChart;
export const MapPinIcon = MapPin;
export const MoreHorizontalIcon = MoreHorizontal;
export const BitcoinIcon = Bitcoin;
export const VideoIcon = Video;
export const TicketIcon = Ticket;
export const MessageCircleReplyIcon = MessageCircleReply;
export const ShoppingBasketIcon = ShoppingBasket;
export const BadgeDollarSignIcon = BadgeDollarSign;
export const ContainerIcon = Container;
// export const AtomIcon = AtomIcon; // Atom already imported as AtomIcon? No, import { Atom as AtomIcon }...
// Wait, I imported Atom, but in aliases list below I need to check.
// I imported `Atom as AtomIcon` in the import list? No, `Atom` and `Atom as AtomIcon`.
// Actually `Atom` is the name.
// Export LucideIcon type for consumers
export type { LucideIcon } from "lucide-react";

export const AtomIcon = Atom;
export const CatIcon = Cat;
export const Package2Icon = Package2;
export const ShipWheelIcon = ShipWheel;
export const TreePalmIcon = TreePalm;
export const UnlinkIcon = Unlink;
export const TruckIcon = Truck;
export const GridIcon = Grid;
export const WalletMinimalIcon = WalletMinimal;
export const ImagesIcon = Images;
export const Image = ImageIcon;
export const ProportionsIcon = Proportions;
export const SquareCheckIcon = SquareCheck;
export const ChartBarDecreasingIcon = ChartBarDecreasing;
export const ChartPieIcon = ChartPie;
export const HospitalIcon = Hospital;
export const SendIcon = Send;
export const SmileIcon = Smile;
export const CircleIcon = Circle;
export const CircleOffIcon = CircleOff;
export const HandIcon = Hand;
export const BoldIcon = Bold;
export const ItalicIcon = Italic;
export const UnderlineIcon = Underline;
export const AlignLeftIcon = AlignLeft;
export const AlignCenterIcon = AlignCenter;
export const ActivityIcon = Activity;
export const ArchiveRestoreIcon = ArchiveRestore;
export const BrainCircuitIcon = BrainCircuit;
export const Building2Icon = Building2;
export const ClipboardCheckIcon = ClipboardCheck;
export const ClipboardIcon = Clipboard;
export const ComponentIcon = Component;
export const CookieIcon = Cookie;
export const FingerprintIcon = Fingerprint;
export const FolderDotIcon = FolderDot;
export const GaugeIcon = Gauge;
export const GraduationCapIcon = GraduationCap;
export const KeyIcon = Key;
export const MessageSquareIcon = MessageSquare;
export const MessageSquareHeartIcon = MessageSquareHeart;
export const ShoppingBagIcon = ShoppingBag;
export const StickyNoteIcon = StickyNote;
export const GithubIcon = Github;
export const RedoDotIcon = RedoDot;
export const BrushIcon = Brush;
export const BrushCleaningIcon = Brush; // Check if BrushCleaning exists or is alias to Brush
export const CoinsIcon = Coins;
export const ShieldAlertIcon = ShieldAlert;
export const LogOutIcon = LogOut;
// export const LayoutIcon = Layout; // Layout might be missing
export const FolderUpIcon = FolderUp;
export const TypeIcon = Type;
export const SpeechIcon = Speech;
export const BookAIcon = BookA;
export const PuzzleIcon = Puzzle;
export const PanelLeftIcon = PanelLeft;
export const CommandIcon = Command;
export const MoonIcon = Moon;
export const SunIcon = Sun;
export const ClipboardMinusIcon = ClipboardMinus;
export const UserCircle2Icon = CircleUser; // Alias to CircleUser
export const UserCircle2 = CircleUser; // Alias to CircleUser
export const SquareKanbanIcon = FolderKanban; // Fallback alias
export const SquareKanban = FolderKanban; // Fallback alias
export const Layout = PanelLeft; // Alias Layout to PanelLeft
export const LayoutIcon = PanelLeft; // Alias LayoutIcon to PanelLeft
export const CircleUserRoundIcon = CircleUserRound;
export const LayoutDashboardIcon = LayoutDashboard;
