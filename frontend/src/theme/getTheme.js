import { createTheme } from "@mui/material/styles";

const getTheme = (mode) => {
    const isLight = mode === 'light';

    return createTheme({
        palette: {
            mode: mode, // 'light' or 'dark'
            primary: {
                main: isLight ? "#1e3a8a" : "#3b82f6",
                light: isLight ? "#2563eb" : "#60a5fa",
            },
            secondary: {
                main: "#eab308",
                light: "#facc15",
            },
            background: {
                default: isLight ? "#ffffff" : "#0f172a",
                paper: isLight ? "#f9fafb" : "#1e293b",
            },
            text: {
                primary: isLight ? "#374151" : "#f1f5f9",
                secondary: isLight ? "#4b5563" : "#cbd5e1",
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: "none",
                        borderRadius: "8px",
                        fontWeight: 600,
                    },
                },
                variants: [
                    {
                        props: { variant: "gold" },
                        style: {
                            backgroundColor: "#eab308",
                            color: isLight ? "#1e3a8a" : "#0f172a",
                            fontWeight: 600,
                            "&:hover": {
                                backgroundColor: "#facc15",
                            },
                        },
                    },
                ],
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            "&:hover fieldset": {
                                borderColor: isLight ? "#2563eb" : "#60a5fa",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: isLight ? "#1e3a8a" : "#3b82f6",
                                boxShadow: isLight
                                    ? "0 0 0 2px rgba(30,58,138,0.2)"
                                    : "0 0 0 2px rgba(59,130,246,0.2)",
                            },
                        },
                    },
                },
            },
            MuiCheckbox: {
                styleOverrides: {
                    root: {
                        color: isLight ? "#1e3a8a" : "#60a5fa",
                        "&.Mui-checked": {
                            color: "#eab308",
                        },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                    },
                },
            },
        },
    });
};

export default getTheme;