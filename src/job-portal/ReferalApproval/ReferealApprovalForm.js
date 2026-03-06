import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Typography,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Button,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    Grid
} from '@mui/material';

const ReferenceCheckForm = () => {
    // Static candidate data (would typically come from props or API)
    const candidateInfo = {
        name: "Sarah Johnson",
        position: "Senior UX Designer",
        contactPerson: "Michael Chen",
        organName: "Tech Innovations Inc.",
        contactNumber: "+1 (415) 555-0123",
        mode: "Email"
    };

    const validationSchema = Yup.object({
        knowDuration: Yup.string().required('This field is required'),
        capacity: Yup.string().required('This field is required'),
        workedAs: Yup.string().required('This field is required'),
        workedFrom: Yup.string().required('This field is required'),
        leftReason: Yup.string().required('This field is required'),
        responsibilities: Yup.string().required('This field is required'),
        performance: Yup.string().required('Performance rating is required'),
        whyPerformance: Yup.string().required('Reason is required'),
        excelledAreas: Yup.string(),
        reemploy: Yup.string().required('This field is required'),
        reemployReason: Yup.string().when('reemploy', {
            is: 'no',
            then: (schema) => schema.required('Reason is required when answer is "no"'),
            otherwise:(s) => s.notRequired()
        }),
        comments: Yup.string(),
        checkerName: Yup.string().required('Name is required'),
        checkerDesignation: Yup.string().required('Designation is required')
    });

    const formik = useFormik({
        initialValues: {
            knowDuration: '',
            capacity: '',
            workedAs: '',
            workedFrom: '',
            leftReason: '',
            responsibilities: '',
            performance: '',
            whyPerformance: '',
            excelledAreas: '',
            reemploy: 'yes',
            reemployReason: '',
            comments: '',
            checkerName: '',
            checkerDesignation: ''
        },
        validationSchema,
        onSubmit: (values) => {
            alert(JSON.stringify({ ...candidateInfo, ...values }, null, 2));
            console.log({ ...candidateInfo, ...values });
        }
    });

    const UnderlineInput = ({ name, width = '120px', placeholder, ...props }) => (
        <TextField
            variant="standard"
            name={name}
            value={formik.values[name]}
            onChange={formik.handleChange}
            error={formik.touched[name] && Boolean(formik.errors[name])}
            helperText={formik.touched[name] && formik.errors[name]}
            placeholder={placeholder}
            InputProps={{
                disableUnderline: true,
                style: {
                    borderBottom: '1px solid #333',
                    textAlign: 'center',
                    padding: '0 0 4px 0',
                    fontSize: '0.95rem'
                }
            }}
            sx={{
                width: width,
                mx: 1,
                '& .MuiInputBase-input': {
                    padding: 0,
                    textAlign: 'center',
                },
                '& .MuiFormHelperText-root': {
                    position: 'absolute',
                    bottom: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap'
                }
            }}
            {...props}
        />
    );

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', p: 3, fontFamily: 'Arial, sans-serif' }}>
            <Paper elevation={3} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0' }}>
                <Typography variant="h5" align="center" sx={{
                    fontWeight: 'bold',
                    mb: 3,
                    color: '#2c3e50',
                    backgroundColor: '#f8f9fa',
                    p: 1,
                    borderRadius: '4px',
                    borderBottom: '2px solid #3498db'
                }}>
                    REFERENCE CHECK FORM - MAIL/Telephonic
                </Typography>

                {/* Static Candidate Information Table */}
                <Table sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{
                                fontWeight: 'bold',
                                width: '40%',
                                borderRight: '1px solid #e0e0e0',
                                backgroundColor: '#f5f7fa'
                            }}>
                                Name of candidate:
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#fff' }}>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                    {candidateInfo.name}
                                </Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{
                                fontWeight: 'bold',
                                borderRight: '1px solid #e0e0e0',
                                backgroundColor: '#f5f7fa'
                            }}>
                                Date:
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#fff' }}>
                                <Typography variant="body1">
                                    {new Date().toLocaleDateString()}
                                </Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{
                                fontWeight: 'bold',
                                borderRight: '1px solid #e0e0e0',
                                backgroundColor: '#f5f7fa'
                            }}>
                                Position applied for:
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#fff' }}>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                    {candidateInfo.position}
                                </Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{
                                fontWeight: 'bold',
                                borderRight: '1px solid #e0e0e0',
                                backgroundColor: '#f5f7fa'
                            }}>
                                Contact person name:
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#fff' }}>
                                <Typography variant="body1">
                                    {candidateInfo.contactPerson}
                                </Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{
                                fontWeight: 'bold',
                                borderRight: '1px solid #e0e0e0',
                                backgroundColor: '#f5f7fa'
                            }}>
                                Organ Name:
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#fff' }}>
                                <Typography variant="body1">
                                    {candidateInfo.organName}
                                </Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{
                                fontWeight: 'bold',
                                borderRight: '1px solid #e0e0e0',
                                backgroundColor: '#f5f7fa'
                            }}>
                                Contact Number:
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#fff' }}>
                                <Typography variant="body1">
                                    {candidateInfo.contactNumber}
                                </Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{
                                fontWeight: 'bold',
                                borderRight: '1px solid #e0e0e0',
                                backgroundColor: '#f5f7fa'
                            }}>
                                Mode of reference check:
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#fff' }}>
                                <Typography variant="body1">
                                    {candidateInfo.mode}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Reference Questions Section */}
                <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                        1. How long you know him/her?
                        <UnderlineInput
                            name="knowDuration"
                            width="100px"
                            placeholder="Enter..."
                        />
                        In what capacity?
                        <UnderlineInput
                            name="capacity"
                            width="150px"
                            placeholder="Enter..."
                        />
                    </Typography>
                </Box>

                <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                        2. I understand that he/she worked with your organization as a
                        <UnderlineInput
                            name="workedAs"
                            width="100px"
                            placeholder="Enter..."
                        />
                        from
                        <UnderlineInput
                            name="workedFrom"
                            width="100px"
                            placeholder="Enter..."
                        />
                        and he/she left your employment due to
                        <UnderlineInput
                            name="leftReason"
                            width="150px"
                            placeholder="Enter..."
                        />
                    </Typography>
                </Box>

                <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                        3. What were his/her main responsibilities?
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        variant="outlined"
                        name="responsibilities"
                        value={formik.values.responsibilities}
                        onChange={formik.handleChange}
                        error={formik.touched.responsibilities && Boolean(formik.errors.responsibilities)}
                        helperText={formik.touched.responsibilities && formik.errors.responsibilities}
                        placeholder="Describe the candidate's responsibilities..."
                        sx={{ backgroundColor: '#fff' }}
                    />
                </Box>

                <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                        4. How would you describe his/her overall work performance?
                    </Typography>
                    <FormControl component="fieldset" sx={{ mb: 1 }}>
                        <RadioGroup
                            name="performance"
                            value={formik.values.performance}
                            onChange={formik.handleChange}
                            row
                            sx={{ mb: 1 }}
                        >
                            <FormControlLabel
                                value="excellent"
                                control={<Radio color="primary" />}
                                label="Excellent"
                                sx={{ mr: 3 }}
                            />
                            <FormControlLabel
                                value="good"
                                control={<Radio color="primary" />}
                                label="Good"
                                sx={{ mr: 3 }}
                            />
                            <FormControlLabel
                                value="average"
                                control={<Radio color="primary" />}
                                label="Average"
                                sx={{ mr: 3 }}
                            />
                            <FormControlLabel
                                value="poor"
                                control={<Radio color="primary" />}
                                label="Poor"
                            />
                        </RadioGroup>
                        {formik.touched.performance && formik.errors.performance && (
                            <Typography variant="caption" color="error">{formik.errors.performance}</Typography>
                        )}
                    </FormControl>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Why?</Typography>
                    <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        variant="outlined"
                        name="whyPerformance"
                        value={formik.values.whyPerformance}
                        onChange={formik.handleChange}
                        error={formik.touched.whyPerformance && Boolean(formik.errors.whyPerformance)}
                        helperText={formik.touched.whyPerformance && formik.errors.whyPerformance}
                        placeholder="Explain the rating..."
                        sx={{ backgroundColor: '#fff' }}
                    />
                </Box>

                <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                        5. Are there any specific areas where the person excelled? (List)
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        variant="outlined"
                        name="excelledAreas"
                        value={formik.values.excelledAreas}
                        onChange={formik.handleChange}
                        placeholder="List areas where the candidate excelled..."
                        sx={{ backgroundColor: '#fff' }}
                    />
                </Box>

                <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                        6. Would you re-employ this person if you were given the opportunity?
                    </Typography>
                    <FormControl component="fieldset" sx={{ mb: 1 }}>
                        <RadioGroup
                            name="reemploy"
                            value={formik.values.reemploy}
                            onChange={formik.handleChange}
                            row
                            sx={{ mb: 1 }}
                        >
                            <FormControlLabel
                                value="yes"
                                control={<Radio color="primary" />}
                                label="Yes"
                                sx={{ mr: 3 }}
                            />
                            <FormControlLabel
                                value="no"
                                control={<Radio color="primary" />}
                                label="No"
                            />
                        </RadioGroup>
                        {formik.touched.reemploy && formik.errors.reemploy && (
                            <Typography variant="caption" color="error">{formik.errors.reemploy}</Typography>
                        )}
                    </FormControl>
                    {formik.values.reemploy === 'no' && (
                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            variant="outlined"
                            name="reemployReason"
                            value={formik.values.reemployReason}
                            onChange={formik.handleChange}
                            error={formik.touched.reemployReason && Boolean(formik.errors.reemployReason)}
                            helperText={formik.touched.reemployReason && formik.errors.reemployReason}
                            placeholder="If 'no', why not? Please explain..."
                            sx={{ mt: 2, backgroundColor: '#fff' }}
                        />
                    )}
                </Box>

                <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                        Comments:
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        variant="outlined"
                        name="comments"
                        value={formik.values.comments}
                        onChange={formik.handleChange}
                        placeholder="Additional comments about the candidate..."
                        sx={{ backgroundColor: '#fff' }}
                    />
                </Box>

                {/* Reference Checker Information */}
                <Grid container spacing={2} sx={{ mt: 3, p: 2, backgroundColor: '#e8f4f8', borderRadius: '4px' }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Name of reference checker"
                            variant="outlined"
                            name="checkerName"
                            value={formik.values.checkerName}
                            onChange={formik.handleChange}
                            error={formik.touched.checkerName && Boolean(formik.errors.checkerName)}
                            helperText={formik.touched.checkerName && formik.errors.checkerName}
                            sx={{ backgroundColor: '#fff' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Designation"
                            variant="outlined"
                            name="checkerDesignation"
                            value={formik.values.checkerDesignation}
                            onChange={formik.handleChange}
                            error={formik.touched.checkerDesignation && Boolean(formik.errors.checkerDesignation)}
                            helperText={formik.touched.checkerDesignation && formik.errors.checkerDesignation}
                            sx={{ backgroundColor: '#fff' }}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={formik.handleSubmit}
                        sx={{
                            px: 5,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                            }
                        }}
                    >
                        Submit Reference
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default ReferenceCheckForm;