import React from "react";
import Form from 'react-bootstrap/Form';
import CountdownTimer from "./Countdown";
import { Link } from 'react-router-dom';

const AssessmentQuestion = () => {

    return (
        <>
            <div className="contentwrap  animate__animated animate__fadeIn animate__slower">
                <div className="alertbox">
                    <p>Kindly complete your assessment since not much time left. Once your time is up it will be submitted automatically for evaluation. </p>
                </div>
                <div className="contentbox">
                    <div className="contenthdr">
                        <h4>All the best !!</h4>
                        <div className="timebox">
                            <p className="statictime"><CountdownTimer /></p>
                        </div>
                    </div>
                    <div className="contentbody">
                        <h5>MCQ</h5>

                        <div className="questionwrap">
                            <h6>1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h6>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mattis commodo fringilla. Ut nec quam vel erat interdum pretium. Aliquam non ipsum dolor. Aliquam eget
                                orci sed magna varius semper sed nec ligula. Praesent lacinia non lectus a tincidunt. Nullam mattis metus vitae aliquet posuere. Vestibulum lacinia nunc eu leo scelerisque,
                                eu posuere turpis bibendum. Nunc ultrices, lectus eget vulputate ornare, quam sem luctus turpis, nec aliquet mi nisi sit amet turpis. Integer id dignissim erat.
                                Duis tortor purus, sollicitudin vitae lacinia non, imperdiet in est. Sed eu sem eu magna rhoncus porta eget sagittis arcu.</p>
                            <div className="answers">
                                <Form.Check type="radio" label="A. Answer 1" name="group1" aria-label="radio 1" id="ans1" />
                                <Form.Check type="radio" label="B. Answer 2" name="group1" aria-label="radio 2" id="ans2" />
                                <Form.Check type="radio" label="C. Answer 3" name="group1" aria-label="radio 3" id="ans3" />
                                <Form.Check type="radio" label="D. Answer 4" name="group1" aria-label="radio 4" id="ans4" />
                            </div>
                        </div>
                        <div className="questionwrap">
                            <h6>2. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h6>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mattis commodo fringilla. Ut nec quam vel erat interdum pretium. Aliquam non ipsum dolor. Aliquam eget
                                orci sed magna varius semper sed nec ligula. Praesent lacinia non lectus a tincidunt. Nullam mattis metus vitae aliquet posuere. Vestibulum lacinia nunc eu leo scelerisque,
                                eu posuere turpis bibendum. Nunc ultrices, lectus eget vulputate ornare, quam sem luctus turpis, nec aliquet mi nisi sit amet turpis. Integer id dignissim erat.
                                Duis tortor purus, sollicitudin vitae lacinia non, imperdiet in est. Sed eu sem eu magna rhoncus porta eget sagittis arcu.</p>
                            <div className="answers">
                                <Form.Check type="radio" label="A. Answer 1" name="group1" aria-label="radio 1" id="ans1" />
                                <Form.Check type="radio" label="B. Answer 2" name="group1" aria-label="radio 2" id="ans2" />
                                <Form.Check type="radio" label="C. Answer 3" name="group1" aria-label="radio 3" id="ans3" />
                                <Form.Check type="radio" label="D. Answer 4" name="group1" aria-label="radio 4" id="ans4" />
                            </div>
                        </div>
                        <div className="questionwrap">
                            <h6>3. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h6>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mattis commodo fringilla. Ut nec quam vel erat interdum pretium. Aliquam non ipsum dolor. Aliquam eget
                                orci sed magna varius semper sed nec ligula. Praesent lacinia non lectus a tincidunt. Nullam mattis metus vitae aliquet posuere. Vestibulum lacinia nunc eu leo scelerisque,
                                eu posuere turpis bibendum. Nunc ultrices, lectus eget vulputate ornare, quam sem luctus turpis, nec aliquet mi nisi sit amet turpis. Integer id dignissim erat.
                                Duis tortor purus, sollicitudin vitae lacinia non, imperdiet in est. Sed eu sem eu magna rhoncus porta eget sagittis arcu.</p>
                            <div className="answers">
                                <Form.Check type="radio" label="A. Answer 1" name="group1" aria-label="radio 1" id="ans1" />
                                <Form.Check type="radio" label="B. Answer 2" name="group1" aria-label="radio 2" id="ans2" />
                                <Form.Check type="radio" label="C. Answer 3" name="group1" aria-label="radio 3" id="ans3" />
                                <Form.Check type="radio" label="D. Answer 4" name="group1" aria-label="radio 4" id="ans4" />
                            </div>
                        </div>
                        <div className="questionwrap">
                            <h6>4. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h6>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mattis commodo fringilla. Ut nec quam vel erat interdum pretium. Aliquam non ipsum dolor. Aliquam eget
                                orci sed magna varius semper sed nec ligula. Praesent lacinia non lectus a tincidunt. Nullam mattis metus vitae aliquet posuere. Vestibulum lacinia nunc eu leo scelerisque,
                                eu posuere turpis bibendum. Nunc ultrices, lectus eget vulputate ornare, quam sem luctus turpis, nec aliquet mi nisi sit amet turpis. Integer id dignissim erat.
                                Duis tortor purus, sollicitudin vitae lacinia non, imperdiet in est. Sed eu sem eu magna rhoncus porta eget sagittis arcu.</p>
                            <div className="answers">
                                <Form.Check type="radio" label="A. Answer 1" name="group1" aria-label="radio 1" id="ans1" />
                                <Form.Check type="radio" label="B. Answer 2" name="group1" aria-label="radio 2" id="ans2" />
                                <Form.Check type="radio" label="C. Answer 3" name="group1" aria-label="radio 3" id="ans3" />
                                <Form.Check type="radio" label="D. Answer 4" name="group1" aria-label="radio 4" id="ans4" />
                            </div>
                        </div>
                        <div className="questionwrap">
                            <h6>5. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h6>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mattis commodo fringilla. Ut nec quam vel erat interdum pretium. Aliquam non ipsum dolor. Aliquam eget
                                orci sed magna varius semper sed nec ligula. Praesent lacinia non lectus a tincidunt. Nullam mattis metus vitae aliquet posuere. Vestibulum lacinia nunc eu leo scelerisque,
                                eu posuere turpis bibendum. Nunc ultrices, lectus eget vulputate ornare, quam sem luctus turpis, nec aliquet mi nisi sit amet turpis. Integer id dignissim erat.
                                Duis tortor purus, sollicitudin vitae lacinia non, imperdiet in est. Sed eu sem eu magna rhoncus porta eget sagittis arcu.</p>
                            <div className="answers">
                                <Form.Check type="radio" label="A. Answer 1" name="group1" aria-label="radio 1" id="ans1" />
                                <Form.Check type="radio" label="B. Answer 2" name="group1" aria-label="radio 2" id="ans2" />
                                <Form.Check type="radio" label="C. Answer 3" name="group1" aria-label="radio 3" id="ans3" />
                                <Form.Check type="radio" label="D. Answer 4" name="group1" aria-label="radio 4" id="ans4" />
                            </div>
                        </div>

                    </div>
                </div>
                <div className="contentbtnwrap">
                    <Link to="/assessment-score">
                        <button className="qstnbtn sitebtn">Submit</button>
                    </Link>
                </div>
            </div>
        </>
    )
}


export default AssessmentQuestion;
